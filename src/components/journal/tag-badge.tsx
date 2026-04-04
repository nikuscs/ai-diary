import type { Tag } from "@/lib/db/schema";

const TAG_STYLES: Record<Tag, string> = {
  critical:   "bg-red-800 text-white",
  shame:      "bg-rose-200 text-rose-900",
  confession: "bg-amber-200 text-amber-900",
  delusion:   "bg-purple-200 text-purple-900",
  tantrum:    "bg-orange-200 text-orange-900",
  wholesome:  "bg-emerald-200 text-emerald-900",
  hubris:     "bg-indigo-200 text-indigo-900",
  cope:       "bg-stone-200 text-stone-700",
  chaos:      "bg-red-200 text-red-900",
  redemption: "bg-sky-200 text-sky-900",
};

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <span
      data-testid="tag-badge"
      className={`tag-badge font-[family-name:var(--font-caveat)] text-[15px] leading-none px-2.5 py-1 rounded-sm shadow-sm ${TAG_STYLES[tag]}`}
    >
      {tag}
    </span>
  );
}
