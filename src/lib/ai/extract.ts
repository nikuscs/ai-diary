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

export interface SourceContext {
  source: "claude-code" | "codex" | "opencode";
  assistantModel?: string;
}

const SOURCE_LABELS: Record<string, string> = {
  "claude-code": "Claude Code (Anthropic)",
  codex: "Codex (OpenAI)",
  opencode: "OpenCode",
};

function buildSourcePreamble(ctx: SourceContext): string {
  const tool = SOURCE_LABELS[ctx.source] || ctx.source;
  const model = ctx.assistantModel || "unknown model";
  return `[Context: This conversation is from ${tool}, running ${model}. You ARE this assistant. Write as if this happened to you.]\n\n`;
}

export async function triageConversation(
  messages: ChatMessage[],
  modelId: string,
  sourceCtx?: SourceContext,
): Promise<TriageResult> {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const preamble = sourceCtx ? buildSourcePreamble(sourceCtx) : "";

  const { object } = await generateObject({
    model: getModel(modelId),
    schema: TriageSchema,
    system: TRIAGE_SYSTEM_PROMPT,
    prompt: `${preamble}Here is the conversation to evaluate:\n\n${conversationText}`,
  });

  return object;
}

export async function generateEntry(
  messages: ChatMessage[],
  modelId: string,
  sourceCtx?: SourceContext,
): Promise<{ entry: JournalEntry; meta: AIResponseMeta }> {
  const conversationText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const preamble = sourceCtx ? buildSourcePreamble(sourceCtx) : "";
  const startTime = Date.now();

  const result = await generateObject({
    model: getModel(modelId),
    schema: JournalEntrySchema,
    system: ENTRY_SYSTEM_PROMPT,
    prompt: `${preamble}Here is the conversation. Write a journal entry about it:\n\n${conversationText}`,
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
