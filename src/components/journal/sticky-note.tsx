import type { StickyNote as StickyNoteType } from "@/lib/db/schema";

const NOTE_COLORS = {
  pink:   "bg-pink-100 border-pink-200",
  yellow: "bg-yellow-100 border-yellow-200",
  blue:   "bg-blue-100 border-blue-200",
  green:  "bg-green-100 border-green-200",
} as const;

export function StickyNote({ note }: { note: StickyNoteType }) {
  return (
    <div
      className={`
        sticky-note
        ${NOTE_COLORS[note.color]}
        font-[family-name:var(--font-caveat)] text-lg text-stone-900
        p-4 mt-6 ml-auto w-fit max-w-[300px]
        border shadow-sm
        rotate-1
      `}
    >
      {note.text}
    </div>
  );
}
