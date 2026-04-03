import { createHash } from "crypto";
import { readFile } from "fs/promises";

export async function hashFile(path: string): Promise<string> {
  const content = await readFile(path);
  return createHash("sha256").update(content).digest("hex");
}

export function hashString(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function expandHome(path: string): string {
  return path.replace(/^~/, process.env.HOME || "");
}
