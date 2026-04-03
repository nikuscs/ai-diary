export function NotebookPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="notebook-bg">
      <div className="notebook-page">
        <div className="tape" />
        {children}
      </div>
    </div>
  );
}
