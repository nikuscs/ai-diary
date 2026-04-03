"use server";

import { scan, type ScanResult } from "@/lib/scanner";

export async function triggerScan(options?: {
  source?: string;
  limit?: number;
  maxAgeDays?: number;
}): Promise<ScanResult> {
  return scan({
    source: options?.source,
    limit: options?.limit ?? 20,
    maxAgeDays: options?.maxAgeDays,
  });
}
