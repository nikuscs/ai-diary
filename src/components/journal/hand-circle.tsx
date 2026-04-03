"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { playSound } from "@/lib/sounds";

export function HandCircle({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    observer.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => observer.disconnect();
  }, []);

  const redraw = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;
    path.style.transition = "none";
    path.style.strokeDashoffset = "1000";
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 1.2s ease-in-out";
    path.style.strokeDashoffset = "0";
    playSound("/sounds/pencil-circle.mp3", 0.15);
  }, []);

  const padX = 6;
  const padY = 4;
  const svgW = size.w + padX * 2;
  const svgH = size.h + padY * 2;
  const cx = svgW / 2;
  const cy = svgH / 2;
  const rx = size.w / 2 + padX - 2;
  const ry = size.h / 2 + padY - 2;

  const d = size.w > 0
    ? `M ${cx + rx} ${cy}
       C ${cx + rx} ${cy - ry * 0.6}, ${cx + rx * 0.55} ${cy - ry - 1}, ${cx - rx * 0.05} ${cy - ry + 1}
       C ${cx - rx * 0.6} ${cy - ry + 2}, ${cx - rx - 1} ${cy - ry * 0.4}, ${cx - rx + 1} ${cy + ry * 0.1}
       C ${cx - rx + 2} ${cy + ry * 0.55}, ${cx - rx * 0.4} ${cy + ry + 1}, ${cx + rx * 0.1} ${cy + ry - 1}
       C ${cx + rx * 0.55} ${cy + ry - 2}, ${cx + rx + 1} ${cy + ry * 0.3}, ${cx + rx - 1} ${cy - ry * 0.15}
       C ${cx + rx} ${cy - ry * 0.4}, ${cx + rx + 1} ${cy - ry * 0.1}, ${cx + rx} ${cy}`
    : "";

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-pointer"
      onClick={redraw}
      onMouseEnter={redraw}
    >
      {children}
      {size.w > 0 && (
        <svg
          className="absolute pointer-events-none"
          style={{
            left: -padX,
            top: -padY,
            width: svgW,
            height: svgH,
          }}
          viewBox={`0 0 ${svgW} ${svgH}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={d}
            stroke="#b33a3a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            filter="url(#pencil-texture)"
            className="hand-circle-path"
          />
        </svg>
      )}
    </span>
  );
}
