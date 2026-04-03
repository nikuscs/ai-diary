import { generateImage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { IMAGE_GENERATION_MODEL, IMAGES_DIR } from "../config";
import { IMAGE_STYLE_PROMPT, IMAGE_NEGATIVE_PROMPT } from "./image-style";
import type { ImagePromptOutput } from "./image-prompt";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function buildPrompt(imagePrompt: ImagePromptOutput): string {
  const elements = imagePrompt.subject.keyElements
    .map((e) => `- ${e}`)
    .join("\n");

  return `${IMAGE_STYLE_PROMPT}

Subject: ${imagePrompt.subject.description}

Key elements:
${elements}

Mood: ${imagePrompt.mood}

${IMAGE_NEGATIVE_PROMPT}`;
}

export async function generateAndSaveImage(
  entryId: string,
  imagePrompt: ImagePromptOutput,
): Promise<string> {
  const prompt = buildPrompt(imagePrompt);

  const { images } = await generateImage({
    model: openrouter.imageModel(IMAGE_GENERATION_MODEL),
    prompt,
    aspectRatio: "16:9",
  });

  const relativePath = `images/${entryId}.png`;
  const fullPath = join(IMAGES_DIR, `${entryId}.png`);

  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, images[0].uint8Array);

  return relativePath;
}
