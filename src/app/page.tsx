import { NotebookPage } from "@/components/journal/notebook-page";
import { JournalHeader } from "@/components/journal/journal-header";
import { StatsBar } from "@/components/journal/stats-bar";
import { EntryCard } from "@/components/journal/entry-card";
import { EmptyState } from "@/components/journal/empty-state";
import { getEntries } from "@/lib/db/queries";
import Link from "next/link";

export default async function HomePage() {
  const entries = await getEntries({ limit: 50 });

  return (
    <NotebookPage>
      <JournalHeader />
      <StatsBar />

      <nav className="flex gap-4 mb-6 font-[family-name:var(--font-lora)] text-sm">
        <Link
          href="/scan"
          className="text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors"
        >
          Scan conversations
        </Link>
        <Link
          href="/settings"
          className="text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors"
        >
          Settings
        </Link>
      </nav>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {entries.map((entry) => (
            <Link key={entry.id} href={`/entry/${entry.id}`} className="block hover:bg-stone-50/30 -mx-2 px-2 rounded transition-colors">
              <EntryCard entry={entry} />
            </Link>
          ))}
        </div>
      )}
    </NotebookPage>
  );
}
