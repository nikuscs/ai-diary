import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";
import type { ChatAdapter, ChatMessage, SessionInfo } from "./types";
import { expandHome, hashFile } from "./utils";

const SESSIONS_DIR = "~/.codex/sessions";
const ARCHIVED_DIR = "~/.codex/archived_sessions";

async function walkJsonlFiles(dir: string): Promise<string[]> {
  const results: string[] = [];

  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    try {
      const info = await stat(fullPath);
      if (info.isDirectory()) {
        const nested = await walkJsonlFiles(fullPath);
        results.push(...nested);
      } else if (entry.endsWith(".jsonl")) {
        results.push(fullPath);
      }
    } catch {
      continue;
    }
  }

  return results;
}

function extractContent(
  content: unknown,
  contentFieldType: string
): string {
  if (!Array.isArray(content)) return "";
  return content
    .filter((item) => item?.type === contentFieldType && typeof item.text === "string")
    .map((item) => item.text)
    .join("");
}

export class CodexAdapter implements ChatAdapter {
  name = "codex" as const;

  async isAvailable(): Promise<boolean> {
    const sessionsDir = expandHome(SESSIONS_DIR);
    const archivedDir = expandHome(ARCHIVED_DIR);
    const [sessionsCheck, archivedCheck] = await Promise.allSettled([
      readdir(sessionsDir),
      readdir(archivedDir),
    ]);
    return sessionsCheck.status === "fulfilled" || archivedCheck.status === "fulfilled";
  }

  async listSessions(): Promise<SessionInfo[]> {
    const sessionsDir = expandHome(SESSIONS_DIR);
    const archivedDir = expandHome(ARCHIVED_DIR);

    const [sessionFiles, archivedFiles] = await Promise.all([
      walkJsonlFiles(sessionsDir),
      walkJsonlFiles(archivedDir),
    ]);

    const allFiles = [...sessionFiles, ...archivedFiles];
    const sessions: SessionInfo[] = [];

    for (const filePath of allFiles) {
      try {
        const content = await readFile(filePath, "utf-8");
        const lines = content.split("\n").filter((line) => line.trim());
        if (lines.length === 0) continue;

        const first = JSON.parse(lines[0]);
        let assistantModel: string | undefined;

        for (const line of lines) {
          const parsed = JSON.parse(line);
          if (parsed.type === "turn_context") {
            const model = (parsed.payload as Record<string, unknown>)?.model;
            if (typeof model === "string") { assistantModel = model; break; }
          }
        }

        sessions.push({
          id: first.id || filePath,
          source: "codex",
          startedAt: first.timestamp ? new Date(first.timestamp) : new Date(0),
          project: first.git?.repository_url,
          filePath,
          assistantModel,
        });
      } catch {
        continue;
      }
    }

    sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    return sessions;
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const filePath = await this.findSessionFile(sessionId);
    if (!filePath) return [];

    const content = await readFile(filePath, "utf-8");
    const messages: ChatMessage[] = [];

    for (const line of content.split("\n")) {
      if (!line.trim()) continue;

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(line);
      } catch {
        continue;
      }

      if (parsed.type !== "message") continue;

      const role = parsed.role as string;
      if (role !== "user" && role !== "assistant") continue;

      const textType = role === "user" ? "input_text" : "output_text";
      const text = extractContent(parsed.content, textType);
      if (!text) continue;

      messages.push({
        role,
        content: text,
        timestamp: parsed.timestamp
          ? new Date(parsed.timestamp as string)
          : undefined,
      });
    }

    return messages;
  }

  async getSessionHash(sessionId: string): Promise<string> {
    const filePath = await this.findSessionFile(sessionId);
    if (!filePath) return "";
    return hashFile(filePath);
  }

  private async findSessionFile(
    sessionId: string
  ): Promise<string | undefined> {
    const sessionsDir = expandHome(SESSIONS_DIR);
    const archivedDir = expandHome(ARCHIVED_DIR);

    const allFiles = [
      ...(await walkJsonlFiles(sessionsDir)),
      ...(await walkJsonlFiles(archivedDir)),
    ];

    for (const filePath of allFiles) {
      try {
        const content = await readFile(filePath, "utf-8");
        const firstLine = content.split("\n").find((line) => line.trim());
        if (!firstLine) continue;

        const parsed = JSON.parse(firstLine);
        if (parsed.id === sessionId) return filePath;
      } catch {
        continue;
      }
    }

    // fallback: sessionId might be the file path itself
    try {
      await stat(sessionId);
      return sessionId;
    } catch {
      return undefined;
    }
  }
}
