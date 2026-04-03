import { ClaudeCodeAdapter } from "./claude-code";
import { CodexAdapter } from "./codex";
import { OpenCodeAdapter } from "./opencode";
import type { ChatAdapter } from "./types";

export function getAdapters(): ChatAdapter[] {
  return [
    new ClaudeCodeAdapter(),
    new CodexAdapter(),
    new OpenCodeAdapter(),
  ];
}
