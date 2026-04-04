import { join } from "path";
import { homedir } from "os";

export const DEFAULT_MODEL = process.env.JOURNAL_MODEL || "google/gemini-2.5-pro";

const DATA_DIR = process.env.DATA_DIR || join(homedir(), ".config", "ai-diary");
export const DATABASE_PATH = process.env.DATABASE_PATH || join(DATA_DIR, "journal.db");

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

export const IMAGE_GENERATION_CHANCE = 0.3;
export const IMAGE_PROMPT_MODEL = "google/gemini-2.5-flash";
export const IMAGE_GENERATION_MODEL = "google/gemini-2.5-flash-image";
export const IMAGES_DIR = join(DATA_DIR, "images");
