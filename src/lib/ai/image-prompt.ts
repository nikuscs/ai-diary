import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { IMAGE_PROMPT_MODEL } from "../config";
import type { Mood, Tag } from "../db/schema";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export interface ImagePromptInput {
  title: string;
  summary: string;
  mood: Mood;
  shameScore: number;
  tags: Tag[];
  stickyNoteText: string;
  topQuote?: string;
}

const ImagePromptSchema = z.object({
  subject: z.object({
    description: z.string(),
    keyElements: z.array(z.string()).min(2).max(5),
  }),
  mood: z.string(),
});

export type ImagePromptOutput = z.infer<typeof ImagePromptSchema>;

const SYSTEM_PROMPT = `You translate coding stories into visual metaphors for hand-drawn ink doodles.

You receive a journal entry summary about an AI coding assistant's experience. Your job is to describe a simple illustration that captures the emotional truth of the story — as a physical, tangible metaphor. Think editorial cartoon.

RULES:
- NEVER depict screens, terminals, code editors, laptops, phones, or any technology
- ALWAYS use physical metaphors: sinking ships, crumbling bridges, house of cards, tightropes, avalanches, tiny figures in absurd situations
- Characters are tiny, simple stick-figure-ish developers — expressive but minimal
- Keep it SIMPLE: 3-5 visual elements max. This is a quick notebook doodle, not a mural
- Match emotional intensity to the shame score (1-3: lighthearted, 4-6: awkward, 7-9: dramatic, 10: catastrophic)
- The illustration should make sense even without reading the entry
- Include one small unexpected or funny detail (a watching animal, an ironic sign, etc.)

OUTPUT:
- subject.description: One paragraph describing the scene
- subject.keyElements: 2-5 bullet points listing the distinct visual elements
- mood: A short phrase capturing the emotional tone (e.g. "false-confidence — the disaster hasn't landed yet")`;

export async function generateImagePrompt(
  input: ImagePromptInput,
): Promise<ImagePromptOutput> {
  const prompt = `Journal entry:
Title: ${input.title}
Summary: ${input.summary}
Mood: ${input.mood}
Shame score: ${input.shameScore}/10
Tags: ${input.tags.join(", ")}
Sticky note: "${input.stickyNoteText}"${input.topQuote ? `\nKey quote: "${input.topQuote}"` : ""}

Describe a simple ink doodle that captures this story as a visual metaphor.`;

  const { object } = await generateObject({
    model: openrouter(IMAGE_PROMPT_MODEL),
    schema: ImagePromptSchema,
    system: SYSTEM_PROMPT,
    prompt,
  });

  return object;
}
