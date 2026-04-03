import type { StickyNote as StickyNoteType } from "@/lib/db/schema";
import { renderInlineFormatting } from "./body-paragraph";

const NOTE_COLORS = {
  pink:   "bg-pink-100 border-pink-200",
  yellow: "bg-yellow-100 border-yellow-200",
  blue:   "bg-blue-100 border-blue-200",
  green:  "bg-green-100 border-green-200",
} as const;

const PIN_COLORS = {
  pink:   { head: "#e11d48", shine: "#fb7185" },
  yellow: { head: "#ca8a04", shine: "#facc15" },
  blue:   { head: "#2563eb", shine: "#60a5fa" },
  green:  { head: "#16a34a", shine: "#4ade80" },
} as const;

function PushPin({ color }: { color: keyof typeof PIN_COLORS }) {
  const { head, shine } = PIN_COLORS[color];
  return (
    <svg
      width="24"
      height="32"
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 drop-shadow-sm"
      aria-hidden="true"
    >
      {/* Pin needle — angled for perspective */}
      <line x1="12" y1="20" x2="13" y2="31" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
      {/* Needle shadow on paper */}
      <ellipse cx="13" cy="31" rx="2" ry="0.8" fill="rgba(0,0,0,0.12)" />
      {/* Pin barrel — cylindrical connector */}
      <rect x="10" y="16" width="4" height="5" rx="1" fill="#9ca3af" />
      <rect x="10.5" y="16" width="1.5" height="5" rx="0.5" fill="#b0b0b0" opacity="0.5" />
      {/* Pin head — sphere with perspective highlight */}
      <circle cx="12" cy="12" r="7" fill={head} />
      <ellipse cx="10" cy="10" rx="3" ry="2.5" fill={shine} opacity="0.45" />
      <ellipse cx="9" cy="9" rx="1.2" ry="1" fill="white" opacity="0.6" />
    </svg>
  );
}

export function StickyNote({ note }: { note: StickyNoteType }) {
  return (
    <div
      className={`
        sticky-note relative
        ${NOTE_COLORS[note.color]}
        font-[family-name:var(--font-caveat)] text-lg text-stone-900
        p-4 pt-5 mt-6 ml-auto w-fit max-w-[300px]
        border shadow-sm
        rotate-1
      `}
    >
      <PushPin color={note.color} />
      {renderInlineFormatting(note.text)}
    </div>
  );
}
