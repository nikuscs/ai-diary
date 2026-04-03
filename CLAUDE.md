# wallofshame.ai

## Quick Start
- `bun install` → install dependencies
- `bun dev` → start dev server (http://localhost:3000)
- Copy `.env.example` to `.env.local` and add API keys

## Stack
- Next.js 15 (App Router, TypeScript, Turbopack)
- shadcn/ui for base components
- SQLite + Kysely for local database
- Vercel AI SDK for LLM calls
- Bun as package manager and runtime

## Conventions
- kebab-case for all files
- Server Components by default, "use client" only for interactive parts
- Named exports (except page/layout which need default)
- No tests for MVP
- No comments unless logic is non-obvious

## Key Paths
- `src/lib/db/` — Kysely instance, schema, migrations
- `src/lib/adapters/` — Chat history adapters (Claude Code, Codex, OpenCode)
- `src/lib/ai/` — LLM extraction prompts and schemas
- `src/lib/scanner/` — Scan orchestration pipeline
- `src/components/journal/` — Journal-specific UI components
- `data/journal.db` — SQLite database (gitignored)

## Database
- SQLite via better-sqlite3 + Kysely
- Migrations run automatically on first DB access
- DB file lives at `./data/journal.db`
