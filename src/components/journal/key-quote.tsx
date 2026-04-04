import type { KeyQuote as KeyQuoteType } from "@/lib/db/schema";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Robot02Icon } from "@hugeicons/core-free-icons";

const ROTATIONS = ["rotate-[1.5deg]", "rotate-[-1.8deg]", "rotate-[1.2deg]"];

export function KeyQuote({ quote, index = 0 }: { quote: KeyQuoteType; index?: number }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isAssistant = quote.speaker === "assistant";

  return (
    <div
      data-testid="key-quote"
      className={`paper-btn bg-white/80 border border-stone-300/50 shadow-[2px_3px_6px_rgba(0,0,0,0.08)] px-4 py-3 my-3 ${rotation} transition-all duration-200 hover:shadow-[2px_4px_10px_rgba(0,0,0,0.12)] hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-stone-400 shrink-0">
          <HugeiconsIcon icon={isAssistant ? Robot02Icon : UserIcon} size={14} />
        </span>
        <p className="font-mono text-sm text-stone-800 leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </p>
      </div>
      <p className="font-[family-name:var(--font-caveat)] text-lg text-amber-900 mt-1.5 italic ml-6">
        {quote.reaction}
      </p>
    </div>
  );
}
