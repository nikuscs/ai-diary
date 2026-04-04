"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import type { ScanResult } from "@/lib/scanner";

export function ScanButton() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    setState("scanning");
    setProgress("Starting...");
    setError(null);
    try {
      const res = await fetch("/api/scan", { method: "POST" });
      if (!res.ok || !res.body) throw new Error("Scan request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const msg = JSON.parse(line);
          if (msg.type === "progress") {
            setProgress(`${msg.current}/${msg.total} — ${msg.status}`);
          } else if (msg.type === "done") {
            setResult(msg);
          } else if (msg.type === "error") {
            setError(msg.error);
          }
        }
      }

      setState("done");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unknown error");
      setState("done");
    }
  }

  if (state === "scanning") {
    return (
      <span data-testid="scan-button" className="inline-flex items-center gap-2 h-8 text-xs">
        <span className="w-3.5 h-3.5 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
        <span className="text-stone-600">{progress}</span>
      </span>
    );
  }

  if (state === "done") {
    return (
      <span data-testid="scan-button" className="inline-flex items-center gap-2 h-8 text-xs">
        {result ? (
          <span className="text-stone-600">+{result.entriesCreated} entries</span>
        ) : (
          <span className="text-red-600">{error || "Scan failed"}</span>
        )}
        <Button variant="link" onClick={() => { setState("idle"); setResult(null); setError(null); }}>
          Dismiss
        </Button>
      </span>
    );
  }

  return (
    <Button variant="paper" size="sm" data-testid="scan-button" onClick={handleScan}>
      <HugeiconsIcon icon={QuillWrite01Icon} size={14} />
      Scan conversations
    </Button>
  );
}
