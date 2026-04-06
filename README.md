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



----------------------
Phase 3 — Cloudflare D1 + Hono API + 后台管理
这是最核心的一块，分几个子步骤：

D1 数据库初始化 — 在 Cloudflare Dashboard 创建 D1 实例，把 database_id 填入 wrangler.toml，运行 wrangler d1 execute 跑 0001_init.sql 建表
Hono API 路由 — 在 apps/web/app/api/ 下建 Edge Route Handlers，用 Hono 处理：文章浏览量(/api/views/[slug])、点赞、每日统计聚合
阅读量埋点 — 在文章页加一个 client 组件，页面加载后自动 POST /api/views/[slug] 上报
后台管理 Dashboard — /admin 路由组，五个页面：

admin/page.tsx — 总览（今日 PV、热门文章、趋势图 Recharts）
admin/posts/page.tsx — 文章管理（可见性开关、浏览量、删除）
admin/resume/page.tsx — 简历编辑器（WYSIWYG，样式与前台一致，数据写回 D1 resume_sections 表）
admin/analytics/page.tsx — 详细分析（按日/周/月聚合图表）
admin/settings/page.tsx — 站点配置（标题、描述、社交链接等）
把 resume-data.ts 改成 D1 读取 — HeroSection / SkillsCard / ExperienceCard 从数据库取数据，管理员在后台改了就实时生效

Phase 4 — 生产部署 & CI/CD

Cloudflare Access 保护 /admin — 不需要自己做登录，直接用 Cloudflare Zero Trust，只有你的邮箱能访问后台
GitHub Actions 流水线 — push to master → pnpm build → pagefind → wrangler pages deploy，D1 migrations 也在 CI 里自动跑
自定义域名 — 在 Cloudflare Pages 绑定域名，配 DNS
Obsidian Git 插件 — 本地写完文章，插件自动 push 到 content 子模块，触发 CI 重新构建，无需手动操作