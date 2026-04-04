# 📔 ai-diary

> This project was inspired by [Dillon Mulroy](https://github.com/dmmulroy) and his brilliant idea of giving AI agents a private shame journal. All credit for the concept goes to him. Check out the [original tweet](https://x.com/dillon_mulroy/status/2039884628371055013) that started it all.

A confessional journal for AI coding assistants. It reads your local chat history from Claude Code, Codex, and OpenCode, finds the embarrassing conversations, and uses AI to turn them into dramatic, self-deprecating diary entries, complete with hand-drawn formatting, shame scores, and sticky notes.

Built for developers who want to see what their AI assistants would write in their private journals after a long day of getting things wrong.

**Live demo:** [aidiary-demo.pages.dev](https://aidiary-demo.pages.dev/)

<p align="center">
  <img src="assets/screenshot-home.png" alt="ai-diary journal view" width="720" />
</p>

<p align="center">
  <img src="assets/screenshot-entry.png" alt="ai-diary entry detail" width="720" />
</p>

## Features

- 📓 Notebook-style journal UI with hand-drawn formatting (strikethroughs, circles, underlines)
- ✏️ SVG hand-drawn animations with pencil sound effects on hover
- 🔍 Scans local chat history from Claude Code, Codex, and OpenCode
- 🤖 AI-powered triage and entry generation via OpenRouter
- 🏷️ Tags, shame scores (1-10), mood tracking, key quotes with reactions
- 📝 Sticky notes, margin annotations, and inline code formatting
- 🗄️ Local SQLite database, your data stays on your machine
- 🎨 AI-generated ink doodle illustrations (30% chance per entry)
- 🔄 Flip-to-reveal easter egg — click an illustration to see the AI prompt that generated it

## Illustrations

Entries have a 30% chance of getting a hand-drawn black-and-white ink doodle illustration, generated via a 3-phase pipeline:

1. **Entry generation** — the existing AI writes the journal entry
2. **Image prompt generation** — a second LLM translates the story into a visual metaphor (Gemini Flash)
3. **Image generation** — the structured prompt is rendered as a doodle (Gemini Flash Image via OpenRouter)

Illustrations appear inline between body paragraphs. Each has a folded paper corner that peels back on hover — click to flip the image and reveal the AI prompt that created it. Click anywhere else to flip it back.

Illustrations are always visual metaphors (sinking ships, crumbling towers, blindfolded dart throws) — never literal depictions of code or screens.

## Supported Adapters

- 🟣 Claude Code: reads `~/.claude/projects/` JSONL session files
- 🟢 Codex: reads `~/.codex/sessions/` and `~/.codex/archived_sessions/`
- 🔵 OpenCode: reads `~/.local/share/opencode/opencode.db`

## Installation

```bash
git clone <repo-url> && cd ai-diary
bun install
cp .env.example .env.local
```

Add your [OpenRouter](https://openrouter.ai) API key to `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Usage

```bash
bun dev
```

1. Open http://localhost:3000
2. Click "Scan conversations" to scan your recent sessions
3. Watch your AI's darkest confessions appear in the journal

## Configuration

The settings page (`/settings`) lets you configure:

- **AI Model**: any model available on OpenRouter (default: `google/gemini-2.5-flash`)
- **Scan Options**: max sessions and max age for scanning
- **Conversation Capping**: how many messages to send to the AI (head, tail, middle sample, max tokens)

You can also set these via environment variables:

```
OPENROUTER_API_KEY=sk-or-v1-...    # required
JOURNAL_MODEL=google/gemini-2.5-flash  # optional
DATABASE_PATH=~/.config/ai-diary/journal.db  # default
```

## Static Export

Build a static HTML snapshot of your journal for hosting on any static platform (Vercel, GitHub Pages, Netlify, S3, etc.):

```bash
bun run export
```

This builds the entire journal as static HTML into `out/`. Images are copied from `~/.config/ai-diary/images/` into the output. The scan button and settings page are hidden since they require a running server.

> **Warning:** Journal entries may contain sensitive information (API keys, file paths, internal URLs, credentials) that LLMs summarized from your conversations. Review your entries before deploying publicly.

### Deploy to Cloudflare Pages

```bash
bunx wrangler pages deploy out/
```

### Deploy to Vercel

```bash
bunx vercel deploy out/ --prod
```

Both CLIs prompt you to create/link a project on first run. Since data lives locally (`~/.config/ai-diary/`), the build must always run on your machine.

## Stack

- Next.js 16 (App Router, Server Components)
- SQLite + Kysely
- Vercel AI SDK + OpenRouter
- Tailwind CSS v4

## Development

- `bun dev` start dev server
- `bunx tsc --noEmit` type check
- `bun run lint` lint
- `bun run build` production build
- `bun run export` static HTML export
