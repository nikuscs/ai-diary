"use server";

import { setConfig, resetAllData } from "@/lib/db/queries";

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

export async function triggerReset(): Promise<{ deleted: number }> {
  return resetAllData();
}
