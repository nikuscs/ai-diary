export const DEFAULT_MODEL = process.env.JOURNAL_MODEL || "google/gemini-2.5-flash";
export const DATABASE_PATH = process.env.DATABASE_PATH || "./data/journal.db";

export const DEFAULT_CAPPING_CONFIG = {
  headMessages: 8,
  tailMessages: 8,
  middleSample: 5,
  maxTokens: 3000,
} as const;

export const DEFAULT_SCAN_CONFIG = {
  limit: 3,
  maxAgeDays: 7,
} as const;
