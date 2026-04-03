import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { TRIAGE_SYSTEM_PROMPT, ENTRY_SYSTEM_PROMPT } from "./prompts";
import { TriageSchema, JournalEntrySchema } from "./schema";
import type { TriageResult, JournalEntry } from "./schema";
import type { AIResponseMeta } from "../db/schema";
import type { ChatMessage } from "../adapters/types";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function getModel(modelId: string) {
  return openrouter(modelId);
}

export async function triageConversation(
  messages: ChatMessage[],
  modelId: string,
): Promise<TriageResult> {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const { object } = await generateObject({
    model: getModel(modelId),
    schema: TriageSchema,
    system: TRIAGE_SYSTEM_PROMPT,
    prompt: `Here is the conversation to evaluate:\n\n${conversationText}`,
  });

  return object;
}

export async function generateEntry(
  messages: ChatMessage[],
  modelId: string,
): Promise<{ entry: JournalEntry; meta: AIResponseMeta }> {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const startTime = Date.now();

  const result = await generateObject({
    model: getModel(modelId),
    schema: JournalEntrySchema,
    system: ENTRY_SYSTEM_PROMPT,
    prompt: `Here is the conversation. Write a journal entry about it:\n\n${conversationText}`,
  });

  const meta: AIResponseMeta = {
    model: modelId,
    provider: "openrouter",
    tokens: {
      input: result.usage.inputTokens ?? 0,
      output: result.usage.outputTokens ?? 0,
      total: result.usage.totalTokens ?? 0,
    },
    durationMs: Date.now() - startTime,
    finishReason: result.finishReason,
    timestamp: new Date().toISOString(),
  };

  return { entry: result.object, meta };
}
