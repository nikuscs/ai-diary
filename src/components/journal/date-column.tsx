export function DateColumn({ date }: { date: Date }) {
  const month = date.toLocaleString("en", { month: "short" }).toUpperCase();
  const day = date.getDate().toString().padStart(2, "0");

  // Deterministic "random" positions from the day number
  const seed = date.getDate() + date.getMonth() * 31;
  const dot1 = { top: 4 + (seed % 5), left: 2 + (seed % 8) };
  const dot2 = { top: 28 + ((seed * 3) % 7), left: 30 + ((seed * 7) % 12) };

  return (
    <div className="text-center pt-1 relative">
      <div className="font-[family-name:var(--font-lora)] text-xs font-bold tracking-wider text-red-800">
        {month}
      </div>
      <div className="font-[family-name:var(--font-lora)] text-2xl font-bold text-stone-800">
        {day}
      </div>
      {/* Ink splatters */}
      <div
        className="absolute w-1 h-1 rounded-full bg-stone-800/15"
        style={{ top: dot1.top, left: dot1.left }}
        aria-hidden="true"
      />
      <div
        className="absolute w-0.5 h-0.5 rounded-full bg-red-800/20"
        style={{ top: dot2.top, left: dot2.left }}
        aria-hidden="true"
      />
    </div>
  );
}
