import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// ── Analytics ─────────────────────────────────────────────
export const postViews = sqliteTable('post_views', {
  slug:      text('slug').primaryKey(),
  viewCount: integer('view_count').default(0).notNull(),
  likeCount: integer('like_count').default(0).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})

export const dailyStats = sqliteTable('daily_stats', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  slug:           text('slug').notNull(),
  date:           text('date').notNull(), // YYYY-MM-DD
  views:          integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
})

// ── Resume ────────────────────────────────────────────────
// data column stores JSON; section_key examples:
//   "hero" | "metrics" | "skills" | "experience"
export const resumeSections = sqliteTable('resume_sections', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  sectionKey: text('section_key').unique().notNull(),
  data:       text('data').notNull(), // JSON string
  sortOrder:  integer('sort_order').default(0),
  updatedAt:  integer('updated_at', { mode: 'timestamp' }),
})

// ── Site settings ─────────────────────────────────────────
export const siteSettings = sqliteTable('site_settings', {
  key:       text('key').primaryKey(),
  value:     text('value').notNull(), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
})
