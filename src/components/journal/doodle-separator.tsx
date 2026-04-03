const SQUIGGLES = [
  "M 0 4 Q 15 0, 30 4 Q 45 8, 60 4 Q 75 0, 90 4 Q 105 8, 120 4 Q 135 0, 150 4",
  "M 0 4 C 10 1, 20 7, 30 3 C 40 -1, 55 9, 70 4 C 85 -1, 100 8, 115 3 C 130 -1, 140 7, 150 4",
  "M 0 4 Q 20 1, 35 5 Q 50 9, 75 3 Q 100 -1, 120 5 Q 135 8, 150 4",
];

export function DoodleSeparator({ index = 0 }: { index?: number }) {
  const d = SQUIGGLES[index % SQUIGGLES.length];

  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg width="150" height="8" viewBox="0 0 150 8" fill="none" className="opacity-25">
        <path
          d={d}
          stroke="#8b7355"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          filter="url(#pencil-texture)"
        />
      </svg>
    </div>
  );
}
