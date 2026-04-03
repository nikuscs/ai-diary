import { getAdapters } from "../adapters";
import { capConversation } from "./capper";
import { triageConversation, generateEntry } from "../ai/extract";
import { generateImagePrompt } from "../ai/image-prompt";
import { generateAndSaveImage } from "../ai/image-generate";
import { isSessionScanned, insertEntry, markSessionScanned, updateEntryImage, getConfig } from "../db/queries";
import { DEFAULT_CAPPING_CONFIG, DEFAULT_MODEL, IMAGE_GENERATION_CHANCE } from "../config";
import type { CappingConfig } from "./capper";

export interface ScanError {
  sessionId: string;
  error: string;
}

export interface ScanResult {
  sessionsFound: number;
  sessionsScanned: number;
  sessionsSkipped: number;
  entriesCreated: number;
  errors: ScanError[];
}

export async function scan(options?: {
  source?: string;
  limit?: number;
  maxAgeDays?: number;
}): Promise<ScanResult> {
  const adapters = getAdapters();
  const cappingConfig = await getConfig<CappingConfig>("capping", DEFAULT_CAPPING_CONFIG);
  const modelId = await getConfig("model", DEFAULT_MODEL);

  const result: ScanResult = {
    sessionsFound: 0,
    sessionsScanned: 0,
    sessionsSkipped: 0,
    entriesCreated: 0,
    errors: [],
  };

  for (const adapter of adapters) {
    if (options?.source && adapter.name !== options.source) continue;
    if (!await adapter.isAvailable()) continue;

    let allSessions;
    try {
      allSessions = await adapter.listSessions();
    } catch {
      continue;
    }
    const cutoff = options?.maxAgeDays
      ? new Date(Date.now() - options.maxAgeDays * 24 * 60 * 60 * 1000)
      : null;
    const sessions = cutoff
      ? allSessions.filter((s) => s.startedAt >= cutoff)
      : allSessions;
    result.sessionsFound += sessions.length;

    for (const session of sessions) {
      if (options?.limit && result.sessionsScanned >= options.limit) break;

      try {
        const hash = await adapter.getSessionHash(session.id);
        if (await isSessionScanned(session.id, hash)) {
          result.sessionsSkipped++;
          continue;
        }

        const messages = await adapter.getMessages(session.id);
        if (messages.length < 2) {
          await markSessionScanned(session, hash, false, "Too few messages");
          result.sessionsScanned++;
          continue;
        }

        const capped = capConversation(messages, cappingConfig);
        const sourceCtx = { source: session.source, assistantModel: session.assistantModel };
        const triage = await triageConversation(capped, modelId, sourceCtx);

        if (!triage.worthy) {
          await markSessionScanned(session, hash, false, triage.reason);
          result.sessionsScanned++;
          continue;
        }

        const { entry, meta } = await generateEntry(capped, modelId, sourceCtx);

        const entryId = await insertEntry({
          session,
          entry: {
            title: entry.title,
            summary: entry.summary,
            shameScore: entry.shameScore,
            mood: entry.mood,
            tags: entry.tags,
            body: entry.body,
            keyQuotes: entry.keyQuotes,
            stickyNote: entry.stickyNote,
            annotation: entry.annotation,
          },
          meta,
          hash,
          triageReason: triage.reason,
        });

        if (entry.stickyNote && Math.random() < IMAGE_GENERATION_CHANCE) {
          try {
            const imagePrompt = await generateImagePrompt({
              title: entry.title,
              summary: entry.summary,
              mood: entry.mood,
              shameScore: entry.shameScore,
              tags: entry.tags,
              stickyNoteText: entry.stickyNote.text,
              topQuote: entry.keyQuotes[0]?.text,
            });
            const imagePath = await generateAndSaveImage(entryId, imagePrompt);
            await updateEntryImage(entryId, imagePath, {
              description: imagePrompt.subject.description,
              keyElements: imagePrompt.subject.keyElements,
              mood: imagePrompt.mood,
            });
          } catch {
            // Image generation is a bonus — skip silently on failure
          }
        }

        result.entriesCreated++;
        result.sessionsScanned++;
      } catch (error) {
        result.errors.push({
          sessionId: session.id,
          error: error instanceof Error ? error.message : String(error),
        });
        result.sessionsScanned++;
      }
    }
  }

  return result;
}
