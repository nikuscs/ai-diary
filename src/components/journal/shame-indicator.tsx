function getShameColor(score: number): string {
  if (score <= 3) return "bg-green-400";
  if (score <= 6) return "bg-yellow-400";
  if (score <= 9) return "bg-orange-400";
  return "bg-red-500";
}

export function ShameIndicator({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2" data-testid="shame-indicator">
      <div
        className={`w-2.5 h-2.5 rounded-full ${getShameColor(score)}`}
        title={`Shame score: ${score}/10`}
      />
      <span className="font-[family-name:var(--font-lora)] text-xs text-stone-400">
        {score}/10
      </span>
    </div>
  );
}
