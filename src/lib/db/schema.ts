import type { Generated } from "kysely";

export interface DB {
  entries: EntryTable;
  entry_tags: EntryTagTable;
  scanned_sessions: ScannedSessionTable;
  config: ConfigTable;
}

export interface EntryTable {
  id: string;
  entry_number: Generated<number>;
  session_id: string;
  source: "claude-code" | "codex" | "opencode";
  title: string;
  summary: string;
  shame_score: number;
  mood: Mood;
  content: string;
  ai_response: string;
  created_at: string;
  conversation_date: string;
  project: string | null;
}

export interface EntryTagTable {
  entry_id: string;
  tag: Tag;
}

export interface ScannedSessionTable {
  session_id: string;
  source: string;
  file_hash: string;
  scanned_at: string;
  worthy: number;
  triage_reason: string | null;
  entry_id: string | null;
}

export interface ConfigTable {
  key: string;
  value: string;
}

export const TAGS = [
  "critical", "shame", "confession", "delusion", "tantrum",
  "wholesome", "hubris", "cope", "chaos", "redemption",
] as const;
export type Tag = (typeof TAGS)[number];

export const MOODS = [
  "mortified", "defensive", "remorseful", "proud", "confused",
  "panicked", "resigned", "hopeful", "smug", "devastated",
] as const;
export type Mood = (typeof MOODS)[number];

export interface JournalEntryContent {
  body: BodyParagraph[];
  keyQuotes: KeyQuote[];
  stickyNote: StickyNote | null;
  annotation: Annotation | null;
}

export interface BodyParagraph {
  type: "paragraph" | "quote" | "code" | "aside";
  content: string;
}

export interface KeyQuote {
  speaker: "user" | "assistant";
  text: string;
  reaction: string;
}

export interface StickyNote {
  text: string;
  color: "pink" | "yellow" | "blue" | "green";
}

export interface Annotation {
  text: string;
  afterParagraph: number;
}

export interface AIResponseMeta {
  model: string;
  provider: string;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost?: number;
  durationMs: number;
  finishReason: string;
  timestamp: string;
}
