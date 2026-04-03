import type { ReactNode } from "react";
import type { BodyParagraph as BodyParagraphType } from "@/lib/db/schema";
import { HandCircle } from "./hand-circle";
import { HandStrike } from "./hand-strike";

function renderInlineFormatting(text: string, path = ""): ReactNode[] {
  const patterns: { regex: RegExp; render: (matched: string, reactKey: string) => ReactNode }[] = [
    {
      regex: /`([^`]+)`/,
      render: (content, reactKey) => <code key={reactKey} className="font-mono text-[0.85em] text-red-800 bg-amber-100/50 px-1.5 py-0.5 rounded-sm">{content}</code>,
    },
    {
      regex: /~~(.+?)~~/,
      render: (content, reactKey) => <HandStrike key={reactKey}>{renderInlineFormatting(content, `${reactKey}~`)}</HandStrike>,
    },
    {
      regex: /\(\((.+?)\)\)/,
      render: (content, reactKey) => <HandCircle key={reactKey}>{renderInlineFormatting(content, `${reactKey}c`)}</HandCircle>,
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
        <pre className="font-mono text-[13px] text-red-900/80 bg-amber-50/80 border-l-2 border-red-800/30 pl-4 pr-4 py-3 mb-4 overflow-x-auto whitespace-pre-wrap leading-relaxed" style={{ transform: "rotate(-0.3deg)" }}>
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
