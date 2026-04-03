import { getConfig } from "@/lib/db/queries";
import { DEFAULT_MODEL, DEFAULT_CAPPING_CONFIG, DEFAULT_SCAN_CONFIG } from "@/lib/config";
import { SettingsForm } from "./settings-form";
import Link from "next/link";

export default async function SettingsPage() {
  const model = await getConfig("model", DEFAULT_MODEL);
  const capping = await getConfig("capping", DEFAULT_CAPPING_CONFIG);
  const scan = await getConfig("scan", DEFAULT_SCAN_CONFIG);

  return (
    <div className="notebook-bg">
      <div className="notebook-page">
        <div className="tape" />

        <nav className="mb-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-500 transition-colors"
          >
            &larr; Back to journal
          </Link>
        </nav>

        <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-stone-900 mb-2">
          Settings
        </h1>
        <p className="font-[family-name:var(--font-lora)] text-sm text-stone-500 mb-8">
          Configure the AI model and conversation scanning behavior.
        </p>

        <SettingsForm model={model} capping={capping} scan={scan} />
      </div>
    </div>
  );
}
