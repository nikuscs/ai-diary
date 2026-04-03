# Sticky Note Illustrations — Implementation Plan

## Overview

Each journal entry with a sticky note has a **30% chance** of generating a hand-drawn ink illustration that visualizes the story as a metaphor. Images are black-and-white, rectangular, and feel like a developer doodled them in a notebook margin.

Generated once per entry, stored locally, never regenerated.

## Pipeline

```
Current:  Conversation → Triage → Entry Generation → Save
New:      Conversation → Triage → Entry Generation → [30% roll] → Image Prompt Gen → Image Gen → Save
                                                          │
                                                     (skip if no stickyNote)
```

### Phase 1 — Entry Generation (existing, no changes)

Already produces everything we need as input for Phase 2:

```typescript
{
  title: "Force-Pushed My Way Into Unemployment",
  summary: "Wiped out main and pretended it wasn't me",
  mood: "mortified",
  shameScore: 8,
  tags: ["shame", "chaos"],
  stickyNote: { text: "git push --force is not a personality trait", color: "pink" },
  keyQuotes: [{ speaker: "user", text: "just push it, what's the worst that could happen", reaction: "..." }]
}
```

### Phase 2 — Image Prompt Generation (new LLM call)

**Model:** `google/gemini-2.5-flash` via OpenRouter (cheap, fast, structured output)

Takes the entry metadata and produces a structured image prompt JSON. The LLM only generates the **variable** part (subject + mood). The fixed style template is baked into the system prompt and assembled at call time.

**Input to Phase 2:**

```typescript
{
  title: string;
  summary: string;
  mood: Mood;
  shameScore: number;
  tags: Tag[];
  stickyNoteText: string;
  topQuote?: string; // first keyQuote text, for flavor
}
```

**Output from Phase 2 (what the LLM generates):**

```json
{
  "subject": {
    "description": "A small figure standing triumphantly on a crumbling bridge, not noticing the last plank falling away behind them. A tiny flag planted at the peak reads nothing — it's blank. Below, a river of binary digits flows past.",
    "keyElements": [
      "Tiny stick-figure developer with confident posture, oblivious expression",
      "Crumbling stone bridge, planks falling one by one into the void",
      "Blank victory flag planted at the midpoint",
      "River of 0s and 1s flowing far below"
    ]
  },
  "mood": "false-confidence — the disaster hasn't landed yet but it will"
}
```

**Phase 2 system prompt guidelines:**
- Translate the coding story into a **visual metaphor** — never draw screens, terminals, code editors, or laptops
- Think editorial cartoon — physical objects, animals, natural disasters, tiny figures in absurd situations
- Keep it **simple enough to work as a quick ink doodle** — 3-5 elements max, no complex backgrounds
- Match the emotional tone: high shame score = more dramatic imagery, low = lighter/funnier
- Characters should be **tiny, simple stick-figure-ish developers** — expressive but minimal
- The illustration should make sense even without reading the entry

### Phase 3 — Image Generation (API call, no LLM)

**Model:** `google/gemini-2.5-flash-image` (Google AI directly, or via OpenRouter if supported)

Assembles the fixed style template + Phase 2 output into a single prompt, sends to the image model.

**Fixed style template (constant across all images):**

```json
{
  "style": {
    "aesthetic": "Hand-drawn black-and-white ink doodle in a developer's notebook",
    "rendering": "Single-weight pen line art, minimal crosshatching for shadows, no fills, loose and expressive like a quick sketch during a meeting. Visible imperfections — wobbly lines, slightly uneven proportions. Not polished illustration, more like talented doodling",
    "color_palette": "Black ink on off-white/cream paper only. No color, no grey wash. Pure line work",
    "composition": "Rectangular vignette (3:2 landscape), subject centered, generous whitespace around edges like it was drawn in the middle of a notebook page",
    "paper_texture": "Subtle off-white cream paper background, barely visible grain"
  },
  "constraints": {
    "avoid": [
      "Color of any kind",
      "Photorealism or 3D rendering",
      "Computer screens, terminals, code editors, laptops, phones",
      "Text, labels, speech bubbles, or UI elements",
      "Complex detailed backgrounds",
      "Realistic human faces or proportions",
      "Corporate or stock-illustration aesthetic",
      "Digital glow effects or gradients"
    ],
    "always": [
      "Pure black ink on cream/off-white paper",
      "Loose hand-drawn line quality",
      "Simple stick-figure-ish characters if humans appear",
      "Visual metaphor, not literal depiction of coding",
      "Enough whitespace to feel like a notebook margin doodle"
    ]
  },
  "dimensions": {
    "aspect_ratio": "3:2",
    "orientation": "landscape",
    "resolution": "768x512"
  }
}
```

**Assembled prompt example (what gets sent to the image model):**

```
Hand-drawn black-and-white ink doodle in a developer's notebook. Single-weight pen line art,
loose and expressive like a quick sketch during a meeting. Pure black ink on off-white cream paper.
No color, no grey wash. Rectangular 3:2 landscape composition with generous whitespace.

Subject: A small figure standing triumphantly on a crumbling bridge, not noticing the last plank
falling away behind them. A tiny flag planted at the peak reads nothing — it's blank. Below,
a river of binary digits flows past.

Key elements:
- Tiny stick-figure developer with confident posture, oblivious expression
- Crumbling stone bridge, planks falling one by one into the void
- Blank victory flag planted at the midpoint
- River of 0s and 1s flowing far below

Mood: false-confidence — the disaster hasn't landed yet but it will

Do not include: color, photorealism, computer screens, text labels, speech bubbles, complex backgrounds.
```

## Sample Prompt JSONs

### Example 1: Force push disaster (shame: 8, mood: mortified)

**Phase 2 output:**

```json
{
  "subject": {
    "description": "A tiny figure pulling a lever labeled with a skull, launching a wrecking ball that swings toward a carefully built tower of blocks. The tower is mid-collapse, blocks scattering. A second tiny figure watches from a distance, holding a coffee cup, frozen.",
    "keyElements": [
      "Stick-figure developer pulling an oversized lever with both hands, grimacing",
      "Wrecking ball mid-swing on a chain, aimed at a tower",
      "Tower of carefully stacked blocks mid-collapse, some blocks mid-air",
      "Second developer in the distance, coffee cup halfway to mouth, staring"
    ]
  },
  "mood": "the moment between the action and the consequence — pure dread"
}
```

### Example 2: Debugging in circles (shame: 4, mood: confused)

**Phase 2 output:**

```json
{
  "subject": {
    "description": "A figure walking in a perfect circle of their own footprints in sand, head down, magnifying glass pointed at the ground. Behind them, a signpost with arrows pointing in every direction. A small crab watches from a rock.",
    "keyElements": [
      "Developer walking in a circle, following their own footprints",
      "Oversized magnifying glass aimed at the ground",
      "Chaotic signpost with arrows pointing everywhere and nowhere",
      "Bemused crab spectator on a small rock"
    ]
  },
  "mood": "earnest futility — genuinely trying but going nowhere"
}
```

### Example 3: Accidental success (shame: 2, mood: smug)

**Phase 2 output:**

```json
{
  "subject": {
    "description": "A figure blindfolded, throwing a dart over their shoulder, and it has landed dead-center on a bullseye. The figure is walking away not having noticed. A cat sits beside the dartboard looking unimpressed.",
    "keyElements": [
      "Blindfolded stick-figure mid-walk-away, one hand still extended from the throw",
      "Dartboard with a single dart in the dead center",
      "Unimpressed cat sitting beside the dartboard, tail curled",
      "Scattered missed darts on the ground around the board"
    ]
  },
  "mood": "oblivious triumph — succeeded entirely by accident and doesn't even know it"
}
```

### Example 4: Production is down (shame: 9, mood: panicked)

**Phase 2 output:**

```json
{
  "subject": {
    "description": "A tiny figure on a sinking ship, frantically bailing water with a teacup while the ship tilts at 45 degrees. The ship's mast is a server rack antenna. Fish swim past at eye level. A life ring floats just out of reach.",
    "keyElements": [
      "Panicked stick-figure bailing water with a comically small teacup",
      "Ship listing heavily, deck at 45 degrees",
      "Mast shaped like a server rack with a blinking antenna",
      "Fish swimming casually past at deck level, life ring floating away"
    ]
  },
  "mood": "active catastrophe — everything is sinking and the tools are inadequate"
}
```

## File Changes

### New files

| File | Purpose |
|------|---------|
| `src/lib/ai/image-prompt.ts` | Phase 2 — LLM call to generate image prompt JSON from entry data |
| `src/lib/ai/image-generate.ts` | Phase 3 — Assemble final prompt + call Gemini image API + save to disk |
| `src/lib/ai/image-style.ts` | Fixed style template constant (the JSON above) |

### Modified files

| File | Change |
|------|--------|
| `src/lib/db/schema.ts` | Add `imagePath: string \| null` to `StickyNote` interface |
| `src/lib/ai/schema.ts` | No change — `imagePath` is added post-generation, not by the entry LLM |
| `src/lib/scanner/index.ts` | After `insertEntry()`, roll 30% dice. If hit + stickyNote exists, run Phase 2 → Phase 3. Update entry with image path |
| `src/lib/config.ts` | Add `IMAGE_GENERATION_CHANCE = 0.3`, `IMAGE_PROMPT_MODEL`, `IMAGE_GENERATION_MODEL` |
| `src/components/journal/sticky-note.tsx` | Render image above text when `imagePath` is present |
| `src/lib/db/queries.ts` | Add `updateEntryImage()` to patch the content JSON after image generation |

### Storage

- Images saved to `data/images/{entry-id}.png`
- `data/images/` directory gitignored alongside `data/journal.db`
- Path stored as relative: `images/{entry-id}.png`
- Served via a Next.js API route or static file serving from `data/`

## Config additions

```typescript
// config.ts
export const IMAGE_GENERATION_CHANCE = 0.3;
export const IMAGE_PROMPT_MODEL = "google/gemini-2.5-flash";
export const IMAGE_GENERATION_MODEL = "google/gemini-2.5-flash-image";
```

```env
# .env.local — only needed if using Google AI directly instead of OpenRouter
GOOGLE_AI_API_KEY=...
```

## Scanner pipeline change (pseudocode)

```typescript
// After insertEntry() succeeds:
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
    await updateEntryImage(entryId, imagePath);
  } catch {
    // Silent skip — image is a bonus, not critical
  }
}
```

## Edge cases

- **No stickyNote:** Skip entirely (don't even roll the dice)
- **Safety filter rejection:** Log and skip silently — the entry is already saved, image is a bonus
- **API timeout:** 30s timeout on image gen, skip on timeout
- **Disk full / write error:** Log and skip
- **Missing API key:** Skip image generation entirely, log warning once

## Resolved decisions

- **OpenRouter** for image gen — same provider as everything else, single API key
- **Next.js Route Handler** for serving images — `app/api/images/[id]/route.ts` reads from `data/images/`, returns the file with proper cache headers. Standard Next.js pattern, no static file hacks
- Badge on illustrated entries — deferred, not MVP
