import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notebook-bg">
      <div className="notebook-page">
        <div className="tape" />

        <div className="text-center py-12">
          <p className="font-[family-name:var(--font-caveat)] text-7xl text-stone-300 mb-4">
            404
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-stone-900 mb-2">
            Page not found
          </h1>
          <p className="font-[family-name:var(--font-lora)] text-sm text-stone-600 mb-8">
            This page has been ripped out of the journal.
          </p>
          <Link
            href="/"
            className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors"
          >
            &larr; Back to journal
          </Link>
        </div>
      </div>
    </div>
  );
}
