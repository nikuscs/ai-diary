import type { KeyQuote as KeyQuoteType } from "@/lib/db/schema";

export function KeyQuote({ quote }: { quote: KeyQuoteType }) {
  return (
    <div className="key-quote pl-4 border-l-2 border-stone-300 my-3">
      <p className="font-mono text-sm text-stone-800 leading-relaxed">
        <span className="font-[family-name:var(--font-caveat)] text-stone-500 text-base not-italic">{quote.speaker}:</span>{" "}
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="font-[family-name:var(--font-caveat)] text-base text-amber-900 mt-1 italic">
        {quote.reaction}
      </p>
    </div>
  );
}
