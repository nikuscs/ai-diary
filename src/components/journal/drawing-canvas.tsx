"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useDrawingMode } from "./drawing-context";
import { playSound } from "@/lib/sounds";

interface Stroke {
  points: { x: number; y: number }[];
}

function getStorageKey(path: string) {
  return `aidiary-drawing:${path}`;
}

function loadStrokes(path: string): Stroke[] {
  try {
    const raw = localStorage.getItem(getStorageKey(path));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStrokes(path: string, strokes: Stroke[]) {
  localStorage.setItem(getStorageKey(path), JSON.stringify(strokes));
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    const prev = stroke.points[i - 1];
    const curr = stroke.points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }
  ctx.stroke();
}

export function DrawingCanvas() {
  const pathname = usePathname();
  const { mode, registerClear } = useDrawingMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setStrokeCount] = useState(0);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const drawing = useRef(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(80, 50, 30, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";
    for (const stroke of strokesRef.current) {
      drawStroke(ctx, stroke);
    }
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    redraw();
  }, [redraw]);

  useEffect(() => {
    strokesRef.current = loadStrokes(pathname);
    setStrokeCount(strokesRef.current.length);
    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [pathname, resize]);

  useEffect(() => {
    registerClear(() => {
      strokesRef.current = [];
      saveStrokes(pathname, []);
      setStrokeCount(0);
      redraw();
    });
  }, [pathname, redraw, registerClear]);

  useEffect(() => {
    const page = containerRef.current?.parentElement;
    if (!page) return;
    page.classList.remove("drawing-mode-draw", "drawing-mode-erase");
    if (mode === "draw") page.classList.add("drawing-mode-draw");
    else if (mode === "erase") page.classList.add("drawing-mode-erase");
    return () => {
      page.classList.remove("drawing-mode-draw", "drawing-mode-erase");
    };
  }, [mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const page = container.parentElement;
    if (!page) return;

    const getPoint = (e: PointerEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      if (mode === "read") return;
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, select, textarea")) return;
      const pt = getPoint(e);
      if (!pt) return;
      drawing.current = true;
      currentStroke.current = { points: [pt] };

      if (mode === "erase") {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = 40;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!drawing.current || !currentStroke.current) return;
      const pt = getPoint(e);
      if (!pt) return;
      currentStroke.current.points.push(pt);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      if (mode === "draw") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = "rgba(80, 50, 30, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      const points = currentStroke.current.points;
      if (points.length >= 2) {
        const prev = points[points.length - 2];
        const curr = points[points.length - 1];
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
    };

    const onUp = () => {
      if (!drawing.current || !currentStroke.current) return;
      drawing.current = false;

      if (mode === "draw" && currentStroke.current.points.length >= 2) {
        strokesRef.current.push(currentStroke.current);
        saveStrokes(pathname, strokesRef.current);
        setStrokeCount(strokesRef.current.length);
        redraw();
        playSound("/sounds/pencil-strike.mp3");
      } else if (mode === "erase") {
        const erasePath = currentStroke.current.points;
        if (erasePath.length >= 2) {
          const before = strokesRef.current.length;
          strokesRef.current = strokesRef.current.filter((stroke) =>
            !stroke.points.some((pt) =>
              erasePath.some((ep) => Math.hypot(pt.x - ep.x, pt.y - ep.y) < 40)
            )
          );
          if (strokesRef.current.length !== before) {
            saveStrokes(pathname, strokesRef.current);
            setStrokeCount(strokesRef.current.length);
          }
          redraw();
        }
      }
      currentStroke.current = null;
    };

    page.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      page.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [mode, pathname, redraw]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[15] pointer-events-none">
      <canvas ref={canvasRef} />
    </div>
  );
}
