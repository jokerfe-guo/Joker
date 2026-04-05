# Joker.Blog

A personal tech blog + portfolio built with Next.js 15 + Hono + Cloudflare D1 + Obsidian.

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 9

### Install pnpm (if not installed)

```bash
npm install -g pnpm
# or
corepack enable pnpm
```

### Install dependencies

```bash
cd joker-blog   # your project directory
pnpm install
```

### Run development server

```bash
pnpm dev
# → http://localhost:3000
```

### Build

```bash
pnpm build
```

## Project Structure

```
joker-blog/
├── apps/
│   ├── web/          # Next.js 15 App Router (main site + admin)
│   └── server/       # Hono API (standalone, also embedded in web)
├── packages/
│   ├── db/           # Drizzle ORM schema + D1 migrations
│   ├── ui/           # Shared UI components
│   └── config/       # Shared TypeScript config
└── content/          # Git submodule: your Obsidian vault
```

## Phases

- ✅ **Phase 1** — Monorepo scaffold + glassmorphism shell + Resume page
- 🔄 **Phase 2** — Blog system: Obsidian Markdown → MDX → pages + search
- 📋 **Phase 3** — Cloudflare D1 + Hono API + Admin dashboard
- 📋 **Phase 4** — Deploy to Cloudflare Pages + CI/CD

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| API | Hono on Cloudflare Edge Functions |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS + Glassmorphism |
| Content | Obsidian Markdown (git submodule) |
| Search | Pagefind |
| Comments | Giscus (GitHub Discussions) |
| Deploy | Cloudflare Pages |
