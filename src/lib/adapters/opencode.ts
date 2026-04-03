import { access } from "fs/promises";
import type { ChatAdapter, ChatMessage, SessionInfo } from "./types";
import { expandHome, hashString } from "./utils";

const DB_PATH = "~/.local/share/opencode/opencode.db";

function openReadonlyDb(dbPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SQLite = require("better-sqlite3");
  return new SQLite(dbPath, { readonly: true });
}

export class OpenCodeAdapter implements ChatAdapter {
  name = "opencode" as const;

  private get dbPath() {
    return expandHome(DB_PATH);
  }

  async isAvailable(): Promise<boolean> {
    try {
      await access(this.dbPath);
      return true;
    } catch {
      return false;
    }
  }

  async listSessions(): Promise<SessionInfo[]> {
    if (!(await this.isAvailable())) return [];

    const db = openReadonlyDb(this.dbPath);
    try {
      const rows = db
        .prepare(
          `SELECT s.id, s.time_created, s.directory, p.worktree as project_path
           FROM session s
           LEFT JOIN project p ON s.project_id = p.id
           WHERE s.time_archived IS NULL
           ORDER BY s.time_created DESC`
        )
        .all() as Array<{
        id: string;
        time_created: number;
        directory: string;
        project_path: string | null;
      }>;

      return rows.map((row) => {
        let assistantModel: string | undefined;
        try {
          const msg = db
            .prepare(`SELECT data FROM message WHERE session_id = ? AND data LIKE '%"model"%' LIMIT 1`)
            .get(row.id) as { data: string } | undefined;
          if (msg) {
            const data = JSON.parse(msg.data);
            const model = data.model;
            if (typeof model === "object" && model?.modelID) {
              assistantModel = model.modelID;
            } else if (typeof model === "string") {
              assistantModel = model;
            }
          }
        } catch {}

        return {
          id: row.id,
          source: "opencode" as const,
          startedAt: new Date(row.time_created),
          project: row.project_path ?? row.directory,
          filePath: this.dbPath,
          assistantModel,
        };
      });
    } finally {
      db.close();
    }
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    if (!(await this.isAvailable())) return [];

    const db = openReadonlyDb(this.dbPath);
    try {
      const rows = db
        .prepare(
          `SELECT m.id, m.data as message_data, m.time_created
           FROM message m
           WHERE m.session_id = ?
           ORDER BY m.time_created ASC`
        )
        .all(sessionId) as Array<{
        id: string;
        message_data: string;
        time_created: number;
      }>;

      const messages: ChatMessage[] = [];

      for (const row of rows) {
        let msgData: Record<string, unknown>;
        try {
          msgData = JSON.parse(row.message_data);
        } catch {
          continue;
        }

        const role = msgData.role as string;
        if (role !== "user" && role !== "assistant") continue;

        const parts = db
          .prepare(
            `SELECT data FROM part WHERE message_id = ? ORDER BY time_created ASC`
          )
          .all(row.id) as Array<{ data: string }>;

        const textParts: string[] = [];
        for (const part of parts) {
          try {
            const partData = JSON.parse(part.data);
            if (partData.type === "text" && typeof partData.content === "string") {
              textParts.push(partData.content);
            }
          } catch {
            continue;
          }
        }

        if (textParts.length === 0) continue;

        messages.push({
          role: role as "user" | "assistant",
          content: textParts.join(""),
          timestamp: new Date(row.time_created),
        });
      }

      return messages;
    } finally {
      db.close();
    }
  }

  async getSessionHash(sessionId: string): Promise<string> {
    if (!(await this.isAvailable())) return "";

    const db = openReadonlyDb(this.dbPath);
    try {
      const rows = db
        .prepare(
          `SELECT id, time_created FROM message WHERE session_id = ? ORDER BY time_created ASC`
        )
        .all(sessionId) as Array<{ id: string; time_created: number }>;

      const combined = rows.map((row) => `${row.id}:${row.time_created}`).join("|");
      return hashString(combined);
    } finally {
      db.close();
    }
  }
}
