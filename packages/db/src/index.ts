import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

export * from './schema'

/**
 * Create a Drizzle ORM instance bound to the Cloudflare D1 database.
 *
 * Usage inside an API Route / Hono handler:
 *   import { getDb } from '@joker/db'
 *   const db = getDb(c.env.DB)          // c = Hono context
 *   const db = getDb(context.env.DB)    // Next.js Route Handler on CF Pages
 */
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

export type DbInstance = ReturnType<typeof getDb>
