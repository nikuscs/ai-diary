import { Fragment } from "react";
import type { Entry } from "@/lib/db/queries";
import { DateColumn } from "./date-column";
import { TagBadge } from "./tag-badge";
import { ShameIndicator } from "./shame-indicator";
import { BodyParagraph } from "./body-paragraph";
import { Annotation } from "./annotation";
import { KeyQuote } from "./key-quote";
import { StickyNote } from "./sticky-note";


function formatTime(date: Date) {
  return date.toLocaleString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function EntryCard({ entry }: { entry: Entry }) {
  const content = entry.content;
  const date = new Date(entry.conversationDate);

  return (
    <article className="entry-card relative py-6 border-t border-stone-300/60">
      <div className="absolute -left-16 top-6 w-14">
        <DateColumn date={date} />
      </div>

      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-[family-name:var(--font-lora)] text-sm text-stone-600">
              Entry #{entry.entryNumber} — {formatTime(date)} UTC
              {entry.assistantModel && (
                <span className="ml-2 text-stone-400" title={entry.source}>
                  ({entry.assistantModel})
                </span>
              )}
            </p>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {entry.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>
          <ShameIndicator score={entry.shameScore} />
        </div>

        <h2 className="font-[family-name:var(--font-caveat)] text-4xl mt-4 text-stone-900">
          {entry.title}
        </h2>

        <div className="font-[family-name:var(--font-lora)] text-[17px] text-stone-900 mt-4">
          {content.body.map((para, i) => (
            <Fragment key={i}>
              <BodyParagraph paragraph={para} />
              {content.annotation?.afterParagraph === i && (
                <Annotation text={content.annotation.text} />
              )}
            </Fragment>
          ))}
        </div>

        {content.keyQuotes.length > 0 && (
          <div className="mt-4 space-y-2">
            {content.keyQuotes.map((quote, i) => (
              <KeyQuote key={i} quote={quote} />
            ))}
          </div>
        )}

        {content.stickyNote && (
          <StickyNote note={content.stickyNote} />
        )}
      </div>
    </article>
  );
}
