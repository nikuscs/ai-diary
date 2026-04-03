import { getStats } from "@/lib/db/queries";

export async function StatsBar() {
  const stats = await getStats();
  return (
    <div className="font-[family-name:var(--font-lora)] text-sm text-stone-700 flex flex-wrap gap-x-8 gap-y-1 border-y border-stone-300/60 py-3 my-6">
      <span>Entries: <strong className="text-red-800">{stats.totalEntries}</strong></span>
      <span>This week: <strong className="text-red-800">{stats.thisWeek}</strong></span>
      <span>Avg shame: <strong className="text-red-800">{stats.avgShame.toFixed(1)} / 10</strong></span>
      <span>Days without incident: <strong className="text-red-800">{stats.daysSinceIncident}</strong></span>
    </div>
  );
}
