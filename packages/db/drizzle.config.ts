import type { Config } from 'drizzle-kit'

/**
 * Drizzle Kit config for generating migrations from schema.ts
 *
 * Usage:
 *   cd packages/db
 *   pnpm drizzle-kit generate   — generate SQL from schema changes
 *   pnpm drizzle-kit studio     — open Drizzle Studio (requires local D1)
 *
 * To apply to Cloudflare D1 (remote):
 *   cd apps/web
 *   pnpm wrangler d1 execute joker-blog \
 *     --file=../../packages/db/migrations/0001_init.sql \
 *     --remote
 */
export default {
  schema:    './src/schema.ts',
  out:       './migrations',
  dialect:   'sqlite',
  driver:    'd1-http',
  dbCredentials: {
    accountId:   process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    databaseId:  process.env.D1_DATABASE_ID ?? '',
    token:       process.env.CLOUDFLARE_API_TOKEN ?? '',
  },
} satisfies Config
