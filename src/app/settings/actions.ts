"use server";

import { setConfig } from "@/lib/db/queries";

export async function saveSettings(_prev: unknown, formData: FormData) {
  const model = String(formData.get("model") ?? "");
  if (model) await setConfig("model", model);

  const headMessages = Number(formData.get("headMessages"));
  const tailMessages = Number(formData.get("tailMessages"));
  const middleSample = Number(formData.get("middleSample"));
  const maxTokens = Number(formData.get("maxTokens"));

  if (!isNaN(headMessages) && !isNaN(tailMessages) && !isNaN(middleSample) && !isNaN(maxTokens)) {
    await setConfig("capping", { headMessages, tailMessages, middleSample, maxTokens });
  }

  return { saved: true };
}
