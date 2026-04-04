export function Annotation({ text }: { text: string }) {
  return (
    <p className="annotation font-[family-name:var(--font-caveat)] text-xl italic text-amber-900 my-3 pl-4" data-testid="annotation">
      <span className="mr-1">&larr;</span>
      {text}
    </p>
  );
}
