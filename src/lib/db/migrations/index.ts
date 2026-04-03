import { type Kysely, sql } from "kysely";
import type { DB } from "../schema";

export async function migrate(db: Kysely<DB>) {
  await sql`
    CREATE TABLE IF NOT EXISTS __migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `.execute(db);

  const applied = await sql<{ name: string }>`
    SELECT name FROM __migrations
  `.execute(db);
  const appliedSet = new Set(applied.rows.map((row) => row.name));

  for (const migration of migrations) {
    if (!appliedSet.has(migration.name)) {
      await migration.up(db);
      await sql`
        INSERT INTO __migrations (name, applied_at) VALUES (${migration.name}, ${new Date().toISOString()})
      `.execute(db);
    }
  }
}

const migrations = [
  {
    name: "001_initial",
    up: async (db: Kysely<DB>) => {
      await sql`
        CREATE TABLE entries (
          id TEXT PRIMARY KEY,
          entry_number INTEGER NOT NULL UNIQUE,
          session_id TEXT NOT NULL,
          source TEXT NOT NULL,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          shame_score INTEGER NOT NULL,
          mood TEXT NOT NULL,
          content TEXT NOT NULL,
          ai_response TEXT NOT NULL,
          created_at TEXT NOT NULL,
          conversation_date TEXT NOT NULL,
          project TEXT
        )
      `.execute(db);

      await sql`
        CREATE TABLE entry_tags (
          entry_id TEXT NOT NULL,
          tag TEXT NOT NULL,
          PRIMARY KEY (entry_id, tag),
          FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        )
      `.execute(db);

      await sql`
        CREATE TABLE scanned_sessions (
          session_id TEXT PRIMARY KEY,
          source TEXT NOT NULL,
          file_hash TEXT NOT NULL,
          scanned_at TEXT NOT NULL,
          worthy INTEGER NOT NULL DEFAULT 0,
          triage_reason TEXT,
          entry_id TEXT,
          FOREIGN KEY (entry_id) REFERENCES entries(id)
        )
      `.execute(db);

      await sql`
        CREATE TABLE config (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `.execute(db);

      await sql`CREATE INDEX idx_entries_created_at ON entries(created_at DESC)`.execute(db);
      await sql`CREATE INDEX idx_entries_shame_score ON entries(shame_score DESC)`.execute(db);
      await sql`CREATE INDEX idx_entries_source ON entries(source)`.execute(db);
      await sql`CREATE INDEX idx_entry_tags_tag ON entry_tags(tag)`.execute(db);
    },
  },
];
