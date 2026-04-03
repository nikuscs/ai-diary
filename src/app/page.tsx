import { NotebookPage } from "@/components/journal/notebook-page";
import { JournalHeader } from "@/components/journal/journal-header";
import { StatsBar } from "@/components/journal/stats-bar";
import { EntryCard } from "@/components/journal/entry-card";
import { EmptyState } from "@/components/journal/empty-state";
import { ScanButton } from "@/components/journal/scan-button";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon } from "@hugeicons/core-free-icons";
import { getEntries } from "@/lib/db/queries";
import Link from "next/link";

export default async function HomePage() {
  const entries = await getEntries({ limit: 50 });

  return (
    <NotebookPage>
      <JournalHeader />
      <StatsBar />

      <nav className="flex items-center gap-4 mb-6 text-sm">
        <ScanButton />
        <Button variant="paper" size="sm" asChild>
          <Link href="/settings">
            <HugeiconsIcon icon={Settings02Icon} size={14} />
            Settings
          </Link>
        </Button>
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
