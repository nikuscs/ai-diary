export function NotebookPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="notebook-bg">
      <div className="notebook-page">
        <div className="tape" />

        {/* Coffee ring stain */}
        <div className="coffee-stain" style={{ top: 180, right: 30, transform: "rotate(15deg)" }} />

        {/* Ink smudges near margin */}
        <div className="ink-smudge" style={{ top: 260 }} />
        <div className="ink-smudge" style={{ top: 540, transform: "rotate(-12deg) scaleX(1.3)" }} />

        {children}

        {/* Page number */}
        <div className="mt-12 pb-4 text-center">
          <span className="font-[family-name:var(--font-caveat)] text-base text-stone-400 italic">
            pg. 1
          </span>
        </div>
      </div>
    </div>
  );
}
