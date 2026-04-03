"use server";

import { setConfig, getConfig } from "@/lib/db/queries";
import { scan, type ScanResult } from "@/lib/scanner";
import { DEFAULT_SCAN_CONFIG } from "@/lib/config";

export async function saveSettings(data: {
  model: string;
  headMessages: number;
  tailMessages: number;
  middleSample: number;
  maxTokens: number;
  scanLimit: number;
  scanMaxAgeDays: number;
}) {
  if (data.model) await setConfig("model", data.model);

  await setConfig("capping", {
    headMessages: data.headMessages,
    tailMessages: data.tailMessages,
    middleSample: data.middleSample,
    maxTokens: data.maxTokens,
  });

  await setConfig("scan", {
    limit: data.scanLimit,
    maxAgeDays: data.scanMaxAgeDays,
  });

  return { saved: true };
}

export async function triggerScan(): Promise<ScanResult> {
  const scanConfig = await getConfig("scan", DEFAULT_SCAN_CONFIG);
  return scan({
    limit: scanConfig.limit,
    maxAgeDays: scanConfig.maxAgeDays,
  });
}
