"use client";

import { useState } from "react";
import Link from "next/link";
import { triggerScan } from "./actions";
import type { ScanResult } from "@/lib/scanner";

export default function ScanPage() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(3);
  const [maxAgeDays, setMaxAgeDays] = useState(7);

  async function handleScan() {
    setState("scanning");
    setError(null);
    try {
      const scanResult = await triggerScan({ limit, maxAgeDays });
      setResult(scanResult);
      setState("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
      setResult(null);
      setState("done");
    }
  }

  const inputClass =
    "w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-sm font-[family-name:var(--font-lora)] text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400";

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
          Scan Conversations
        </h1>
        <p className="font-[family-name:var(--font-lora)] text-sm text-stone-500 mb-8">
          Discover embarrassing conversations from your coding assistants and turn them into journal entries.
        </p>

        {state === "idle" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-6 font-[family-name:var(--font-lora)] text-sm text-stone-700">
              <label className="flex items-center gap-2">
                Max sessions:
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  min={1}
                  max={50}
                  className={inputClass}
                />
              </label>
              <label className="flex items-center gap-2">
                From last:
                <input
                  type="number"
                  value={maxAgeDays}
                  onChange={(e) => setMaxAgeDays(Number(e.target.value))}
                  min={1}
                  max={365}
                  className={inputClass}
                />
                <span>days</span>
              </label>
            </div>

            <button
              onClick={handleScan}
              className="font-[family-name:var(--font-lora)] bg-stone-800 text-white px-6 py-3 rounded-lg hover:bg-stone-700 transition-colors text-sm"
            >
              Start Scanning
            </button>
          </div>
        )}

        {state === "scanning" && (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
            <span className="font-[family-name:var(--font-lora)] text-sm text-stone-600">
              Scanning conversations... this may take a while.
            </span>
          </div>
        )}

        {state === "done" && result && (
          <div className="space-y-4">
            <div className="font-[family-name:var(--font-lora)] text-sm text-stone-800 space-y-2 bg-stone-100/50 p-4 rounded-lg">
              <p>Found <strong>{result.sessionsFound}</strong> sessions (last {maxAgeDays} days)</p>
              <p>Scanned <strong>{result.sessionsScanned}</strong> new sessions</p>
              <p>Skipped <strong>{result.sessionsSkipped}</strong> already-scanned sessions</p>
              <p>Created <strong className="text-red-700">{result.entriesCreated}</strong> journal entries</p>
            </div>

            {result.errors.length > 0 && (
              <div className="font-mono text-xs text-red-600 bg-red-50 p-3 rounded space-y-1">
                <p className="font-[family-name:var(--font-lora)] text-sm font-medium">Errors:</p>
                {result.errors.map((scanError, i) => (
                  <p key={i}>{scanError.sessionId}: {scanError.error}</p>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Link
                href="/"
                className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 transition-colors"
              >
                View journal
              </Link>
              <button
                onClick={() => { setState("idle"); setResult(null); }}
                className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 decoration-stone-300 transition-colors"
              >
                Scan again
              </button>
            </div>
          </div>
        )}

        {state === "done" && !result && (
          <div className="space-y-4">
            <p className="font-[family-name:var(--font-lora)] text-sm text-red-600">
              {error ? `Scan failed: ${error}` : "Something went wrong during the scan."}
            </p>
            <button
              onClick={() => { setState("idle"); }}
              className="font-[family-name:var(--font-lora)] text-sm text-stone-500 hover:text-stone-800 underline underline-offset-2 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
