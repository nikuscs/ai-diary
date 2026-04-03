import type { ReactNode } from "react";
import type { BodyParagraph as BodyParagraphType } from "@/lib/db/schema";

function renderInlineFormatting(text: string, path = ""): ReactNode[] {
  const patterns: { regex: RegExp; render: (matched: string, reactKey: string) => ReactNode }[] = [
    {
      regex: /`([^`]+)`/,
      render: (content, reactKey) => <code key={reactKey} className="font-mono text-[13px] bg-stone-200/70 text-stone-900 px-1.5 py-0.5 rounded border border-stone-300/50">{content}</code>,
    },
    {
      regex: /~~(.+?)~~/,
      render: (content, reactKey) => <span key={reactKey} className="pencil-strike">{renderInlineFormatting(content, `${reactKey}~`)}</span>,
    },
    {
      regex: /\(\((.+?)\)\)/,
      render: (content, reactKey) => <span key={reactKey} className="border-2 border-red-700 rounded-[50%] px-1 py-0.5 inline-block">{renderInlineFormatting(content, `${reactKey}c`)}</span>,
    },
    {
      regex: /__(.+?)__/,
      render: (content, reactKey) => <span key={reactKey} className="underline decoration-stone-600 decoration-2 underline-offset-2">{renderInlineFormatting(content, `${reactKey}u`)}</span>,
    },
    {
      regex: /(?<![a-zA-Z\d])_([^_]+?)_(?![a-zA-Z\d])/,
      render: (content, reactKey) => <strong key={reactKey} className="font-bold text-[1.05em]">{renderInlineFormatting(content, `${reactKey}e`)}</strong>,
    },
    {
      regex: /\*\*(.+?)\*\*/,
      render: (content, reactKey) => <strong key={reactKey} className="font-bold text-[1.05em]">{renderInlineFormatting(content, `${reactKey}s`)}</strong>,
    },
    {
      regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/,
      render: (content, reactKey) => <em key={reactKey} className="italic">{renderInlineFormatting(content, `${reactKey}i`)}</em>,
    },
  ];

  for (const pattern of patterns) {
    const match = pattern.regex.exec(text);
    if (match && match.index !== undefined) {
      const before = text.slice(0, match.index);
      const after = text.slice(match.index + match[0].length);
      const key = `${path}${match.index}`;
      const results: ReactNode[] = [];
      if (before) results.push(...renderInlineFormatting(before, `${key}b`));
      results.push(pattern.render(match[1], key));
      if (after) results.push(...renderInlineFormatting(after, `${key}a`));
      return results;
    }
  }

  return [text];
}

export function BodyParagraph({ paragraph }: { paragraph: BodyParagraphType }) {
  switch (paragraph.type) {
    case "paragraph":
      return (
        <p className="mb-4 leading-8">
          {renderInlineFormatting(paragraph.content)}
        </p>
      );
    case "quote":
      return (
        <blockquote className="pl-4 border-l-2 border-stone-400 mb-4 text-stone-800 italic leading-8">
          {renderInlineFormatting(paragraph.content)}
        </blockquote>
      );
    case "code":
      return (
        <pre className="font-mono text-[13px] bg-stone-200/60 text-stone-900 p-4 rounded border border-stone-300/40 mb-4 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {paragraph.content}
        </pre>
      );
    case "aside":
      return (
        <p className="font-[family-name:var(--font-caveat)] text-xl italic text-stone-800 mb-4 leading-relaxed">
          {renderInlineFormatting(paragraph.content)}
        </p>
      );
  }
}
