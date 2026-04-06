# Joker.AI — Deployment Guide

Cloudflare Pages + D1 + Zero Trust Access. Zero server management, 100% edge.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 9.15+ | `npm i -g pnpm` |
| Wrangler | 3+ | `pnpm add -g wrangler` |
| GitHub account | — | Push access to this repo |
| Cloudflare account | Free | https://cloudflare.com |

---

## Step 1 — Clone & install

```bash
git clone --recurse-submodules <your-repo-url>
cd Joker
pnpm install
```

---

## Step 2 — Create Cloudflare D1 database

```bash
cd apps/web
pnpm wrangler login          # browser OAuth

pnpm wrangler d1 create joker-blog
# Output:
#   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` into `apps/web/wrangler.toml`:

```toml
[[d1_databases]]
binding      = "DB"
database_name = "joker-blog"
database_id  = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"   # ← paste here
```

---

## Step 3 — Run D1 migrations

```bash
# From apps/web
pnpm wrangler d1 execute joker-blog \
  --file=../../packages/db/migrations/0001_init.sql \
  --remote

pnpm wrangler d1 execute joker-blog \
  --file=../../packages/db/migrations/0002_seed_resume.sql \
  --remote
```

Verify tables were created:

```bash
pnpm wrangler d1 execute joker-blog \
  --command="SELECT name FROM sqlite_master WHERE type='table';" \
  --remote
```

---

## Step 4 — Local development

```bash
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local if needed

# Option A: Next.js dev server only (no D1 in dev — API returns empty data)
pnpm dev

# Option B: Full local stack with D1 via Wrangler (recommended)
cd apps/web
pnpm wrangler pages dev -- pnpm next dev
```

Open http://localhost:3000 · Admin at http://localhost:3000/admin (auth bypassed locally).

---

## Step 5 — Set GitHub repository secrets

Go to **GitHub → repo → Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF API token (see below) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_GISCUS_REPO` | `owner/repo` (from giscus.app) |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | from giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | from giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | from giscus.app |

**Creating the CF API token:**
1. Cloudflare Dashboard → My Profile → API Tokens → Create Token
2. Use "Edit Cloudflare Workers" template, then add:
   - **Account** → D1 → Edit
   - **Account** → Cloudflare Pages → Edit
3. Copy the token — it only shows once.

---

## Step 6 — First deploy

Push to `master` — GitHub Actions will:
1. Type-check + lint
2. Run D1 migrations
3. `pnpm build` (Next.js build + Pagefind index)
4. `wrangler pages deploy` to Cloudflare Pages

```bash
git push origin master
# Watch: GitHub → Actions tab
```

After deploy, your site is live at `<project>.pages.dev`.

---

## Step 7 — Custom domain

1. Cloudflare Dashboard → Pages → joker-blog → Custom domains → Add domain
2. Add your domain (must be on Cloudflare DNS)
3. Cloudflare handles HTTPS automatically

---

## Step 8 — Protect /admin with Cloudflare Access

**One-time setup — no passwords, no user DB needed.**

1. Cloudflare Dashboard → Zero Trust → Access → Applications → Add
2. **Application name:** Joker Blog Admin
3. **Application domain:** `yourdomain.com/admin*`
4. **Policy:** Allow — Email → `your@email.com`
5. Copy your **Team domain** (e.g. `myteam.cloudflareaccess.com`)

Set the team domain so the middleware can redirect to the login portal:

```bash
cd apps/web
pnpm wrangler secret put CF_TEAM_DOMAIN
# Enter: myteam.cloudflareaccess.com
```

Now `/admin` is protected — only your email can access it via one-click email magic link.

---

## Step 9 — Obsidian blog workflow

1. Install **Obsidian Git** plugin in your Obsidian vault
2. Configure vault to auto-push to the `content/` submodule repo on save (or interval)
3. Every push to `content/` triggers the `content.yml` workflow → rebuild + deploy in ~2 min

Your writing workflow: Write in Obsidian → save → auto-push → live in 2 minutes.

---

## Useful commands

```bash
# Check D1 data
pnpm wrangler d1 execute joker-blog \
  --command="SELECT * FROM post_views ORDER BY view_count DESC LIMIT 10;" \
  --remote

# Reset resume sections (re-run seed)
pnpm wrangler d1 execute joker-blog \
  --command="DELETE FROM resume_sections;" \
  --remote
pnpm wrangler d1 execute joker-blog \
  --file=../../packages/db/migrations/0002_seed_resume.sql \
  --remote

# Tail production logs
pnpm wrangler pages deployment tail --project-name=joker-blog

# Preview a branch build locally
cd apps/web
pnpm wrangler pages dev .next
```

---

## Architecture overview

```
Obsidian (local) ──git push──► GitHub (content submodule)
                                      │
                               GitHub Actions
                                      │ pnpm build + pagefind
                                      │ wrangler pages deploy
                                      ▼
                            Cloudflare Pages (edge)
                                      │
                              Next.js 15 (RSC)
                              ├── /              Resume (SSG)
                              ├── /blog          Blog listing (SSG)
                              ├── /blog/:slug    Article (SSG + ISR)
                              ├── /projects      Projects (SSG)
                              ├── /admin/*       Admin dashboard (dynamic)
                              └── /api/*         Hono API → D1
                                                       │
                                              Cloudflare D1 (SQLite)
                                              ├── post_views
                                              ├── daily_stats
                                              ├── resume_sections
                                              └── site_settings
```
