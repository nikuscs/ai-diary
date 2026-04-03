export function DateColumn({ date }: { date: Date }) {
  const month = date.toLocaleString("en", { month: "short" }).toUpperCase();
  const day = date.getDate().toString().padStart(2, "0");

  return (
    <div className="text-center pt-1">
      <div className="font-[family-name:var(--font-lora)] text-xs font-bold tracking-wider text-red-800">
        {month}
      </div>
      <div className="font-[family-name:var(--font-lora)] text-2xl font-bold text-stone-800">
        {day}
      </div>
    </div>
  );
}
