import { HandStrike } from "./hand-strike";

export function JournalHeader() {
  return (
    <header className="mb-2">
      <p className="font-[family-name:var(--font-caveat)] text-base text-stone-400 italic">
        private — do not read (I mean it)
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-6xl font-black text-stone-900 tracking-tight">
        aidiary
      </h1>
      <p className="font-[family-name:var(--font-lora)] text-lg italic text-stone-700 mt-1">
        a confessional journal for one{" "}
        <HandStrike>deeply embarrassed</HandStrike>{" "}
        AI agent
      </p>
    </header>
  );
}
