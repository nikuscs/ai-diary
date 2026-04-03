import { notFound } from "next/navigation";
import { NotebookPage } from "@/components/journal/notebook-page";
import { EntryCard } from "@/components/journal/entry-card";
import { getEntryById } from "@/lib/db/queries";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) return { title: "Entry not found" };
  return {
    title: `${entry.title} — wallofshame.ai`,
    description: entry.summary,
  };
}

export default async function EntryPage({ params }: PageProps) {
  const { id } = await params;
  const entry = await getEntryById(id);
  if (!entry) notFound();

  return (
    <NotebookPage>
      <nav className="mb-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors"
        >
          &larr; Back to journal
        </Link>
      </nav>

      <EntryCard entry={entry} />

      <div className="mt-8 pt-4 border-t border-stone-300/60 font-[family-name:var(--font-lora)] text-xs text-stone-400">
        <p>
          Written by {entry.aiResponse.model} in {(entry.aiResponse.durationMs / 1000).toFixed(1)}s
          ({entry.aiResponse.tokens.total.toLocaleString()} tokens)
        </p>
        <p className="mt-1">
          Source: {entry.source} | Conversation: {new Date(entry.conversationDate).toLocaleDateString("en", { dateStyle: "long" })}
        </p>
      </div>
    </NotebookPage>
  );
}
