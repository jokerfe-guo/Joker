import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { eq, sql, desc } from 'drizzle-orm'
import { getDb, postViews, dailyStats, resumeSections, siteSettings } from '@joker/db'

// ─── Type for Cloudflare Pages env bindings ────────────────────────────────
type Env = { DB: D1Database }

const app = new Hono<{ Bindings: Env }>().basePath('/api')

// ─── Health ───────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', phase: 3 }))

// ─── Helper: get D1 from request env ─────────────────────────────────────
function db(c: Parameters<Parameters<typeof app.get>[1]>[0]) {
  // Cloudflare Pages exposes env via c.env
  const env = (c as unknown as { env: Env }).env
  if (!env?.DB) throw new Error('D1 binding not available — ensure wrangler.toml is configured')
  return getDb(env.DB)
}

// ─── Today's date string YYYY-MM-DD ──────────────────────────────────────
function today() {
  return new Date().toISOString().split('T')[0]
}

// ══════════════════════════════════════════════════════════════════════════
// VIEWS & LIKES
// ══════════════════════════════════════════════════════════════════════════

/** GET /api/views/:slug — return view + like count for a post */
app.get('/views/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const d = db(c)
    const row = await d.select().from(postViews).where(eq(postViews.slug, slug)).get()
    return c.json({ slug, viewCount: row?.viewCount ?? 0, likeCount: row?.likeCount ?? 0 })
  } catch {
    return c.json({ slug, viewCount: 0, likeCount: 0 })
  }
})

/** POST /api/views/:slug — increment view count (called client-side on page load) */
app.post('/views/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const d = db(c)
    const dateStr = today()

    // Upsert post_views
    await d
      .insert(postViews)
      .values({ slug, viewCount: 1, likeCount: 0, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: postViews.slug,
        set: {
          viewCount: sql`${postViews.viewCount} + 1`,
          updatedAt: new Date(),
        },
      })

    // Upsert daily_stats
    await d
      .insert(dailyStats)
      .values({ slug, date: dateStr, views: 1, uniqueVisitors: 1 })
      .onConflictDoUpdate({
        target: [dailyStats.slug, dailyStats.date],
        set: { views: sql`${dailyStats.views} + 1` },
      })

    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 500)
  }
})

/** POST /api/likes/:slug — toggle like (client uses localStorage to track state) */
app.post('/likes/:slug', async (c) => {
  const slug = c.req.param('slug')
  const body = await c.req.json<{ delta: 1 | -1 }>()
  const delta = body.delta === -1 ? -1 : 1
  try {
    const d = db(c)
    await d
      .insert(postViews)
      .values({ slug, viewCount: 0, likeCount: delta > 0 ? 1 : 0, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: postViews.slug,
        set: {
          likeCount: sql`MAX(0, ${postViews.likeCount} + ${delta})`,
          updatedAt: new Date(),
        },
      })
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 500)
  }
})

// ══════════════════════════════════════════════════════════════════════════
// ANALYTICS (admin)
// ══════════════════════════════════════════════════════════════════════════

/** GET /api/admin/analytics/overview — top posts + site totals */
app.get('/admin/analytics/overview', async (c) => {
  try {
    const d = db(c)

    // Total views across all posts
    const [{ total }] = await d
      .select({ total: sql<number>`COALESCE(SUM(${postViews.viewCount}), 0)` })
      .from(postViews)

    // Top 10 posts by views
    const topPosts = await d
      .select({ slug: postViews.slug, viewCount: postViews.viewCount, likeCount: postViews.likeCount })
      .from(postViews)
      .orderBy(desc(postViews.viewCount))
      .limit(10)

    return c.json({ total, topPosts })
  } catch {
    return c.json({ total: 0, topPosts: [] })
  }
})

/** GET /api/admin/analytics/daily?days=30 — daily view totals for chart */
app.get('/admin/analytics/daily', async (c) => {
  const days = Number(c.req.query('days') ?? 30)
  try {
    const d = db(c)
    const rows = await d
      .select({
        date: dailyStats.date,
        views: sql<number>`SUM(${dailyStats.views})`,
      })
      .from(dailyStats)
      .groupBy(dailyStats.date)
      .orderBy(desc(dailyStats.date))
      .limit(days)
    return c.json(rows.reverse()) // chronological order for chart
  } catch {
    return c.json([])
  }
})

// ══════════════════════════════════════════════════════════════════════════
// RESUME SECTIONS (admin CRUD)
// ══════════════════════════════════════════════════════════════════════════

/** GET /api/admin/resume — all resume sections ordered by sort_order */
app.get('/admin/resume', async (c) => {
  try {
    const d = db(c)
    const rows = await d
      .select()
      .from(resumeSections)
      .orderBy(resumeSections.sortOrder)
    return c.json(rows.map((r) => ({ ...r, data: JSON.parse(r.data) })))
  } catch {
    return c.json([])
  }
})

/** GET /api/admin/resume/:key — single section */
app.get('/admin/resume/:key', async (c) => {
  const key = c.req.param('key')
  try {
    const d = db(c)
    const row = await d
      .select()
      .from(resumeSections)
      .where(eq(resumeSections.sectionKey, key))
      .get()
    if (!row) return c.json({ error: 'not found' }, 404)
    return c.json({ ...row, data: JSON.parse(row.data) })
  } catch {
    return c.json({ error: 'db error' }, 500)
  }
})

/** PUT /api/admin/resume/:key — upsert section data */
app.put('/admin/resume/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.json<{ data: unknown; sortOrder?: number }>()
  try {
    const d = db(c)
    await d
      .insert(resumeSections)
      .values({
        sectionKey: key,
        data: JSON.stringify(body.data),
        sortOrder: body.sortOrder ?? 0,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: resumeSections.sectionKey,
        set: {
          data: JSON.stringify(body.data),
          sortOrder: body.sortOrder ?? 0,
          updatedAt: new Date(),
        },
      })
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 500)
  }
})

// ══════════════════════════════════════════════════════════════════════════
// SITE SETTINGS (admin CRUD)
// ══════════════════════════════════════════════════════════════════════════

/** GET /api/admin/settings — all site settings as { key: value } map */
app.get('/admin/settings', async (c) => {
  try {
    const d = db(c)
    const rows = await d.select().from(siteSettings)
    const map: Record<string, unknown> = {}
    for (const row of rows) {
      try { map[row.key] = JSON.parse(row.value) } catch { map[row.key] = row.value }
    }
    return c.json(map)
  } catch {
    return c.json({})
  }
})

/** PUT /api/admin/settings — batch upsert settings */
app.put('/admin/settings', async (c) => {
  const body = await c.req.json<Record<string, unknown>>()
  try {
    const d = db(c)
    for (const [key, value] of Object.entries(body)) {
      await d
        .insert(siteSettings)
        .values({ key, value: JSON.stringify(value), updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: JSON.stringify(value), updatedAt: new Date() },
        })
    }
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 500)
  }
})

// ══════════════════════════════════════════════════════════════════════════
// POST VISIBILITY (stored in site_settings as JSON list)
// ══════════════════════════════════════════════════════════════════════════

/** GET /api/admin/posts/hidden — list of hidden post slugs */
app.get('/admin/posts/hidden', async (c) => {
  try {
    const d = db(c)
    const row = await d
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'hidden_posts'))
      .get()
    const list: string[] = row ? JSON.parse(row.value) : []
    return c.json(list)
  } catch {
    return c.json([])
  }
})

/** PUT /api/admin/posts/hidden — replace hidden slugs list */
app.put('/admin/posts/hidden', async (c) => {
  const body = await c.req.json<{ slugs: string[] }>()
  try {
    const d = db(c)
    await d
      .insert(siteSettings)
      .values({ key: 'hidden_posts', value: JSON.stringify(body.slugs), updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: JSON.stringify(body.slugs), updatedAt: new Date() },
      })
    return c.json({ ok: true })
  } catch {
    return c.json({ ok: false }, 500)
  }
})

// ─── Export Next.js route handlers ───────────────────────────────────────
export const GET    = handle(app)
export const POST   = handle(app)
export const PUT    = handle(app)
export const DELETE = handle(app)
