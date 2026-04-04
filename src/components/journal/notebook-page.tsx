export function NotebookPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="notebook-bg">
      <div className="notebook-page" data-testid="notebook-page">
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

        <footer className="font-[family-name:var(--font-lora)] text-[11px] text-stone-400 text-center pt-2 pb-1 border-t border-stone-300/40">
          <p>
            built by{" "}
            <a href="https://x.com/nikuscs" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-stone-300/60 hover:text-stone-600 transition-colors">@nikuscs</a>
            {" · "}
            <a href="https://github.com/nikuscs/ai-diary" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-stone-300/60 hover:text-stone-600 transition-colors">source</a>
            {" · "}
            inspired by{" "}
            <a href="https://x.com/dillon_mulroy/status/2039884628371055013" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-stone-300/60 hover:text-stone-600 transition-colors">@dillon_mulroy</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
