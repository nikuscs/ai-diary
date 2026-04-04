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

// Page curl effect adapted from @joostkiens.
// Multi-stop gradient + box-shadow, grows on hover.
const CURL_ANGLE: Record<Corner, string> = {
  tl: "135deg",
  tr: "225deg",
  br: "315deg",
  bl: "45deg",
};

const CURL_POSITION: Record<Corner, React.CSSProperties> = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  br: { bottom: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
};

function getCurlStyle(corner: Corner, size: number): React.CSSProperties {
  const angle = CURL_ANGLE[corner];
  return {
    position: "absolute",
    ...CURL_POSITION[corner],
    width: size,
    height: size,
    background: `linear-gradient(${angle}, #f5f0e8, #ede6da 45%, #d5cec2 50%, #a8a295 50%, #b5afa3 56%, #c2bcb0 62%, #ede6da 80%, #f5f0e8 100%)`,
    boxShadow: "0 0 6px rgba(0,0,0,0.25)",
    pointerEvents: "none",
    zIndex: 5,
    transition: "width 0.4s ease, height 0.4s ease, box-shadow 0.4s ease",
  };
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
  const curlSize = hovered ? 60 : 28;
  const curlStyle = getCurlStyle(corner, curlSize);
  if (hovered) curlStyle.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

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
          className="relative overflow-hidden border border-stone-300/40 p-2.5 rotate-[-0.8deg]"
          style={{
            backfaceVisibility: "hidden",
            background: "#f5f0e8",
            boxShadow: "2px 3px 8px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.02)",
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
              mixBlendMode: "multiply",
              opacity: 0.85,
            }}
            loading="lazy"
          />
          {/* Page curl */}
          <div style={curlStyle} />
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
