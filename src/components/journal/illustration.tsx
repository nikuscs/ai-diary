"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { JournalEntryContent } from "@/lib/db/schema";

type Illustration = NonNullable<JournalEntryContent["illustration"]>;

const CORNERS = ["tr", "tl", "br", "bl"] as const;
type Corner = (typeof CORNERS)[number];

function stableIndex(id: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % max;
}

// Lea Verou-style folded corner: gradient cut + rotated fold piece
// Each corner needs: background gradient angle, fold position, fold rotation, transform-origin, shadow direction
function getFoldConfig(corner: Corner, hovered: boolean) {
  const size = hovered ? 2.8 : 1.5; // em
  const foldW = size * 1.15;
  const foldH = size * 2;
  const offset = size * 0.87;
  const opacity = hovered ? 0.2 : 0.1;

  const configs: Record<Corner, {
    bgGradient: string;
    foldPosition: React.CSSProperties;
    foldTransform: string;
    foldOrigin: string;
    foldShadow: string;
    foldBorderRadius: string;
    foldGradient: string;
  }> = {
    tr: {
      bgGradient: `linear-gradient(-150deg, transparent ${size}em, #f5f0e8 0)`,
      foldPosition: { top: 0, right: 0 },
      foldTransform: `translateY(${-offset}em) rotate(-30deg)`,
      foldOrigin: "bottom right",
      foldShadow: `-2px 2px 3px rgba(0,0,0,${opacity})`,
      foldBorderRadius: "0 0 0 8px",
      foldGradient: "linear-gradient(to left bottom, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.1))",
    },
    tl: {
      bgGradient: `linear-gradient(-30deg, transparent ${size}em, #f5f0e8 0)`,
      foldPosition: { top: 0, left: 0 },
      foldTransform: `translateY(${-offset}em) rotate(30deg)`,
      foldOrigin: "bottom left",
      foldShadow: `2px 2px 3px rgba(0,0,0,${opacity})`,
      foldBorderRadius: "0 0 8px 0",
      foldGradient: "linear-gradient(to right bottom, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.1))",
    },
    br: {
      bgGradient: `linear-gradient(150deg, transparent ${size}em, #f5f0e8 0)`,
      foldPosition: { bottom: 0, right: 0 },
      foldTransform: `translateY(${offset}em) rotate(30deg)`,
      foldOrigin: "top right",
      foldShadow: `-2px -2px 3px rgba(0,0,0,${opacity})`,
      foldBorderRadius: "8px 0 0 0",
      foldGradient: "linear-gradient(to left top, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.1))",
    },
    bl: {
      bgGradient: `linear-gradient(30deg, transparent ${size}em, #f5f0e8 0)`,
      foldPosition: { bottom: 0, left: 0 },
      foldTransform: `translateY(${offset}em) rotate(-30deg)`,
      foldOrigin: "top left",
      foldShadow: `2px -2px 3px rgba(0,0,0,${opacity})`,
      foldBorderRadius: "0 8px 0 0",
      foldGradient: "linear-gradient(to right top, transparent 50%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.1))",
    },
  };

  return { ...configs[corner], foldW: `${foldW}em`, foldH: `${foldH}em` };
}

export function Illustration({
  illustration,
  entryId,
}: {
  illustration: Illustration;
  entryId: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageId = illustration.imagePath.replace("images/", "").replace(".png", "");
  const corner = CORNERS[stableIndex(entryId, CORNERS.length)];
  const hasPrompt = !!illustration.prompt;
  const fold = getFoldConfig(corner, hovered);

  const playSound = useCallback(() => {
    const audio = new Audio("/sounds/pencil-strike.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !hasPrompt) return;

    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFlipped((f) => !f);
      playSound();
    };

    el.addEventListener("click", handler, true);
    return () => el.removeEventListener("click", handler, true);
  }, [hasPrompt, playSound]);

  useEffect(() => {
    if (!flipped) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
        setFlipped(false);
        playSound();
      }
    };
    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, [flipped, playSound]);

  return (
    <figure
      ref={containerRef}
      className="my-8 flex justify-center"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative transition-transform duration-500 ${hasPrompt ? "cursor-pointer" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front — the doodle */}
        <div
          className="relative border border-stone-300/40 p-2.5 rotate-[-0.8deg]"
          style={{
            backfaceVisibility: "hidden",
            background: fold.bgGradient,
            boxShadow: "2px 3px 8px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.02)",
            transition: "background 0.3s ease",
          }}
        >
          {/* Tape strip */}
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/40 rotate-[1deg] z-10"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          />
          <img
            src={`/api/images/${imageId}`}
            alt=""
            className="w-full"
            style={{
              filter: "grayscale(0.6) sepia(0.35) saturate(0.5) contrast(1.1) brightness(1.05)",
              opacity: 0.85,
            }}
            loading="lazy"
          />
          {/* Folded corner — Lea Verou technique: rotated piece with gradient showing paper underside */}
          <div
            style={{
              position: "absolute",
              ...fold.foldPosition,
              width: fold.foldW,
              height: fold.foldH,
              background: fold.foldGradient,
              transform: fold.foldTransform,
              transformOrigin: fold.foldOrigin,
              borderRadius: fold.foldBorderRadius,
              boxShadow: fold.foldShadow,
              transition: "all 0.3s ease",
            }}
          />
        </div>

        {/* Back — the prompt */}
        {hasPrompt && (
          <div
            className="absolute inset-0 bg-amber-50/95 border border-stone-300/50 p-5 rotate-[-0.8deg] overflow-auto"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "2px 3px 8px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.02)",
            }}
          >
            <p className="font-[family-name:var(--font-caveat)] text-xs text-stone-400 mb-2">
              image prompt — how this doodle was born
            </p>
            <p className="font-[family-name:var(--font-lora)] text-sm text-stone-800 leading-relaxed mb-3">
              {illustration.prompt!.description}
            </p>
            <ul className="space-y-1 mb-3">
              {illustration.prompt!.keyElements.map((el, i) => (
                <li
                  key={i}
                  className="font-[family-name:var(--font-lora)] text-xs text-stone-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-stone-400"
                >
                  {el}
                </li>
              ))}
            </ul>
            <p className="font-[family-name:var(--font-caveat)] text-base text-amber-800 italic">
              mood: {illustration.prompt!.mood}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
