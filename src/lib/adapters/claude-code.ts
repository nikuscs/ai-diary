import { readdir, readFile } from "fs/promises";
import { join } from "path";
import type { ChatAdapter, ChatMessage, SessionInfo } from "./types";
import { expandHome, hashFile } from "./utils";

const BASE_DIR = "~/.claude/projects";

function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((item) => item?.type === "text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("");
  }
  return "";
}

export class ClaudeCodeAdapter implements ChatAdapter {
  name = "claude-code" as const;

  private get baseDir() {
    return expandHome(BASE_DIR);
  }

  async isAvailable(): Promise<boolean> {
    try {
      await readdir(this.baseDir);
      return true;
    } catch {
      return false;
    }
  }

  async listSessions(): Promise<SessionInfo[]> {
    const sessions: SessionInfo[] = [];

    let projectDirs: string[];
    try {
      projectDirs = await readdir(this.baseDir);
    } catch {
      return [];
    }

    for (const encodedProject of projectDirs) {
      const projectPath = join(this.baseDir, encodedProject);
      let files: string[];
      try {
        files = await readdir(projectPath);
      } catch {
        continue;
      }

      const project = decodeURIComponent(encodedProject);

      for (const file of files) {
        if (!file.endsWith(".jsonl")) continue;

        const sessionId = file.replace(/\.jsonl$/, "");
        const filePath = join(projectPath, file);

        let startedAt = new Date(0);
        try {
          const content = await readFile(filePath, "utf-8");
          const firstLine = content.split("\n").find((line) => line.trim());
          if (firstLine) {
            const parsed = JSON.parse(firstLine);
            if (parsed.timestamp) {
              startedAt = new Date(parsed.timestamp);
            }
          }
        } catch {
        }

        sessions.push({
          id: sessionId,
          source: "claude-code",
          startedAt,
          project,
          filePath,
        });
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

      if (parsed.type !== "user" && parsed.type !== "assistant") continue;

      const msg = parsed.message as Record<string, unknown> | undefined;
      if (!msg) continue;

      const text = extractText(msg.content);
      if (!text) continue;

      messages.push({
        role: parsed.type as "user" | "assistant",
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
    let projectDirs: string[];
    try {
      projectDirs = await readdir(this.baseDir);
    } catch {
      return undefined;
    }

    for (const encodedProject of projectDirs) {
      const filePath = join(
        this.baseDir,
        encodedProject,
        `${sessionId}.jsonl`
      );
      try {
        await readFile(filePath, { flag: "r" });
        return filePath;
      } catch {
        continue;
      }
    }

    return undefined;
  }
}
