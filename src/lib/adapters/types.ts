export interface ChatAdapter {
  name: "claude-code" | "codex" | "opencode";
  isAvailable(): Promise<boolean>;
  listSessions(): Promise<SessionInfo[]>;
  getMessages(sessionId: string): Promise<ChatMessage[]>;
  getSessionHash(sessionId: string): Promise<string>;
}

export interface SessionInfo {
  id: string;
  source: "claude-code" | "codex" | "opencode";
  startedAt: Date;
  project?: string;
  filePath: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}
