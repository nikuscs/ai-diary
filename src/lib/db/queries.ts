import { nanoid } from "nanoid";
import type { Selectable } from "kysely";
import { getDbReady } from "./index";
import type { Tag, EntryTable, JournalEntryContent, AIResponseMeta, Mood } from "./schema";
import type { SessionInfo } from "../adapters/types";

export interface Entry {
  id: string;
  entryNumber: number;
  sessionId: string;
  source: EntryTable["source"];
  title: string;
  summary: string;
  shameScore: number;
  mood: Mood;
  content: JournalEntryContent;
  aiResponse: AIResponseMeta;
  createdAt: string;
  conversationDate: string;
  project: string | null;
  assistantModel: string | null;
  tags: Tag[];
}

type EntryRow = Selectable<EntryTable>;

function parseEntry(row: EntryRow, tags: Tag[]): Entry {
  return {
    id: row.id,
    entryNumber: row.entry_number,
    sessionId: row.session_id,
    source: row.source,
    title: row.title,
    summary: row.summary,
    shameScore: row.shame_score,
    mood: row.mood,
    content: JSON.parse(row.content) as JournalEntryContent,
    aiResponse: JSON.parse(row.ai_response) as AIResponseMeta,
    createdAt: row.created_at,
    conversationDate: row.conversation_date,
    project: row.project,
    assistantModel: row.assistant_model,
    tags,
  };
}

export async function getEntries(options?: {
  limit?: number;
  offset?: number;
  tag?: Tag;
}): Promise<Entry[]> {
  const db = await getDbReady();
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  let query = db
    .selectFrom("entries")
    .selectAll()
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(offset);

  if (options?.tag) {
    query = query.where("id", "in",
      db.selectFrom("entry_tags").select("entry_id").where("tag", "=", options.tag)
    );
  }

  const rows = await query.execute();

  const entries: Entry[] = [];
  for (const row of rows) {
    const tagRows = await db
      .selectFrom("entry_tags")
      .select("tag")
      .where("entry_id", "=", row.id)
      .execute();
    entries.push(parseEntry(row, tagRows.map((row) => row.tag)));
  }

  return entries;
}

export async function getEntryById(id: string): Promise<Entry | null> {
  const db = await getDbReady();

  const row = await db
    .selectFrom("entries")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!row) return null;

  const tagRows = await db
    .selectFrom("entry_tags")
    .select("tag")
    .where("entry_id", "=", id)
    .execute();

  return parseEntry(row, tagRows.map((row) => row.tag));
}

export async function getStats(): Promise<{
  totalEntries: number;
  thisWeek: number;
  avgShame: number;
  daysSinceIncident: number;
}> {
  const db = await getDbReady();

  const totalResult = await db
    .selectFrom("entries")
    .select((eb) => eb.fn.countAll().as("count"))
    .executeTakeFirstOrThrow();
  const totalEntries = Number(totalResult.count);

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekResult = await db
    .selectFrom("entries")
    .select((eb) => eb.fn.countAll().as("count"))
    .where("created_at", ">=", oneWeekAgo)
    .executeTakeFirstOrThrow();
  const thisWeek = Number(weekResult.count);

  const avgResult = await db
    .selectFrom("entries")
    .select((eb) => eb.fn.avg("shame_score").as("avg"))
    .executeTakeFirstOrThrow();
  const avgShame = Number(avgResult.avg) || 0;

  const lastEntry = await db
    .selectFrom("entries")
    .select("created_at")
    .orderBy("created_at", "desc")
    .limit(1)
    .executeTakeFirst();

  let daysSinceIncident = 0;
  if (lastEntry) {
    const diff = Date.now() - new Date(lastEntry.created_at).getTime();
    daysSinceIncident = Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  return { totalEntries, thisWeek, avgShame, daysSinceIncident };
}

export async function isSessionScanned(sessionId: string, fileHash: string): Promise<boolean> {
  const db = await getDbReady();
  const row = await db
    .selectFrom("scanned_sessions")
    .select("file_hash")
    .where("session_id", "=", sessionId)
    .executeTakeFirst();

  return row?.file_hash === fileHash;
}

export async function markSessionScanned(
  session: SessionInfo,
  fileHash: string,
  worthy: boolean,
  triageReason: string | null,
  entryId?: string,
): Promise<void> {
  const db = await getDbReady();
  await db
    .insertInto("scanned_sessions")
    .values({
      session_id: session.id,
      source: session.source,
      file_hash: fileHash,
      scanned_at: new Date().toISOString(),
      worthy: worthy ? 1 : 0,
      triage_reason: triageReason,
      entry_id: entryId ?? null,
    })
    .onConflict((oc) =>
      oc.column("session_id").doUpdateSet({
        file_hash: fileHash,
        scanned_at: new Date().toISOString(),
        worthy: worthy ? 1 : 0,
        triage_reason: triageReason,
        entry_id: entryId ?? null,
      })
    )
    .execute();
}

export async function insertEntry(params: {
  session: SessionInfo;
  entry: {
    title: string;
    summary: string;
    shameScore: number;
    mood: Mood;
    tags: Tag[];
    body: JournalEntryContent["body"];
    keyQuotes: JournalEntryContent["keyQuotes"];
    stickyNote: JournalEntryContent["stickyNote"];
    annotation: JournalEntryContent["annotation"];
  };
  meta: AIResponseMeta;
  hash: string;
  triageReason: string;
}): Promise<string> {
  const db = await getDbReady();
  const id = nanoid();

  const maxResult = await db
    .selectFrom("entries")
    .select((eb) => eb.fn.max("entry_number").as("max"))
    .executeTakeFirstOrThrow();
  const entryNumber = (Number(maxResult.max) || 0) + 1;

  const content: JournalEntryContent = {
    body: params.entry.body,
    keyQuotes: params.entry.keyQuotes,
    stickyNote: params.entry.stickyNote,
    annotation: params.entry.annotation,
  };

  await db
    .insertInto("entries")
    .values({
      id,
      entry_number: entryNumber,
      session_id: params.session.id,
      source: params.session.source as "claude-code" | "codex" | "opencode",
      title: params.entry.title,
      summary: params.entry.summary,
      shame_score: params.entry.shameScore,
      mood: params.entry.mood,
      content: JSON.stringify(content),
      ai_response: JSON.stringify(params.meta),
      created_at: new Date().toISOString(),
      conversation_date: params.session.startedAt.toISOString(),
      project: params.session.project ?? null,
      assistant_model: params.session.assistantModel ?? null,
    })
    .execute();

  for (const tag of params.entry.tags) {
    await db
      .insertInto("entry_tags")
      .values({ entry_id: id, tag })
      .execute();
  }

  await markSessionScanned(params.session, params.hash, true, params.triageReason, id);

  return id;
}

export async function updateEntryImage(
  entryId: string,
  imagePath: string,
  prompt?: { description: string; keyElements: string[]; mood: string },
): Promise<void> {
  const db = await getDbReady();

  const row = await db
    .selectFrom("entries")
    .select("content")
    .where("id", "=", entryId)
    .executeTakeFirst();

  if (!row) return;

  const content = JSON.parse(row.content) as JournalEntryContent;
  const maxIndex = Math.max(0, content.body.length - 1);
  const afterParagraph = Math.floor(Math.random() * maxIndex);

  content.illustration = { imagePath, afterParagraph, prompt };
  await db
    .updateTable("entries")
    .set({ content: JSON.stringify(content) })
    .where("id", "=", entryId)
    .execute();
}

export async function getConfig<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDbReady();
  const row = await db
    .selectFrom("config")
    .select("value")
    .where("key", "=", key)
    .executeTakeFirst();

  if (!row) return defaultValue;
  return JSON.parse(row.value) as T;
}

export async function setConfig<T>(key: string, value: T): Promise<void> {
  const db = await getDbReady();
  await db
    .insertInto("config")
    .values({ key, value: JSON.stringify(value) })
    .onConflict((oc) =>
      oc.column("key").doUpdateSet({ value: JSON.stringify(value) })
    )
    .execute();
}

export async function resetAllData(): Promise<{ deleted: number }> {
  const db = await getDbReady();
  const { numDeletedRows } = await db.deleteFrom("entries").executeTakeFirstOrThrow();
  await db.deleteFrom("entry_tags").execute();
  await db.deleteFrom("scanned_sessions").execute();
  return { deleted: Number(numDeletedRows) };
}
