-- Cloudflare D1 initial migration
-- Run: npx wrangler d1 execute joker-blog --file=packages/db/migrations/0001_init.sql

CREATE TABLE IF NOT EXISTS post_views (
  slug        TEXT PRIMARY KEY,
  view_count  INTEGER NOT NULL DEFAULT 0,
  like_count  INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER
);

CREATE TABLE IF NOT EXISTS daily_stats (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  slug             TEXT NOT NULL,
  date             TEXT NOT NULL,
  views            INTEGER DEFAULT 0,
  unique_visitors  INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_slug_date ON daily_stats(slug, date);

CREATE TABLE IF NOT EXISTS resume_sections (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key  TEXT UNIQUE NOT NULL,
  data         TEXT NOT NULL,
  sort_order   INTEGER DEFAULT 0,
  updated_at   INTEGER
);

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER
);

-- Seed default site settings
INSERT OR IGNORE INTO site_settings (key, value) VALUES
  ('site_title',       '"Joker.AI"'),
  ('site_description', '"Crafting high-performance digital experiences."'),
  ('social_links',     '{"github":"https://github.com/jokerfe-guo"}'),
  ('giscus_config',    '{"repo":"","repoId":"","category":"","categoryId":""}');
