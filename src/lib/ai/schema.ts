import { z } from "zod";

export const TriageSchema = z.object({
  worthy: z.boolean(),
  reason: z.string(),
});

export type TriageResult = z.infer<typeof TriageSchema>;

export const JournalEntrySchema = z.object({
  title: z.string(),
  summary: z.string(),
  body: z.array(z.object({
    type: z.enum(["paragraph", "quote", "code", "aside"]),
    content: z.string(),
  })),
  keyQuotes: z.array(z.object({
    speaker: z.enum(["user", "assistant"]),
    text: z.string(),
    reaction: z.string(),
    afterParagraph: z.number().optional(),
  })).max(3),
  tags: z.array(z.enum([
    "critical", "shame", "confession", "delusion", "tantrum",
    "wholesome", "hubris", "cope", "chaos", "redemption",
  ])).min(1).max(3),
  shameScore: z.number().int().min(1).max(10),
  mood: z.enum([
    "mortified", "defensive", "remorseful", "proud",
    "confused", "panicked", "resigned", "hopeful",
    "smug", "devastated",
  ]),
  stickyNote: z.object({
    text: z.string(),
    color: z.enum(["pink", "yellow", "blue", "green"]),
  }).nullable(),
  annotation: z.object({
    text: z.string(),
    afterParagraph: z.number(),
  }).nullable(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;
