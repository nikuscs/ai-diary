"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { playSound } from "@/lib/sounds";

export function HandStrike({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new ResizeObserver(() => {
      setWidth(el.offsetWidth);
    });
    observer.observe(el);
    setWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  const redraw = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;
    path.style.transition = "none";
    path.style.strokeDashoffset = "500";
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 0.8s ease-in-out";
    path.style.strokeDashoffset = "0";
    playSound("/sounds/pencil-strike.mp3", 0.9);
  }, []);

  const padX = 3;
  const svgW = width + padX * 2;
  const svgH = 6;
  const y = svgH / 2;

  // Slightly wobbly line for hand-drawn feel
  const d = width > 0
    ? `M ${padX - 1} ${y + 0.3} Q ${svgW * 0.25} ${y - 0.8}, ${svgW * 0.5} ${y + 0.4} Q ${svgW * 0.75} ${y + 1.2}, ${svgW - padX + 1} ${y - 0.3}`
    : "";

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-pointer text-stone-500"
      onClick={redraw}
      onMouseEnter={redraw}
    >
      {children}
      {width > 0 && (
        <svg
          className="absolute pointer-events-none"
          style={{
            left: -padX,
            top: "48%",
            width: svgW,
            height: svgH,
            transform: "translateY(-50%) rotate(-0.4deg)",
          }}
          viewBox={`0 0 ${svgW} ${svgH}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={d}
            stroke="#b33a3a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#pencil-texture)"
            className="hand-strike-path"
          />
        </svg>
      )}
    </span>
  );
}
