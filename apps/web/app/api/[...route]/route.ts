import { Hono } from 'hono'
import { handle } from 'hono/vercel'

// Phase 3: full API with D1 bindings
// For now, a minimal Hono app with a health check
const app = new Hono().basePath('/api')

app.get('/health', (c) => c.json({ status: 'ok', phase: 1 }))

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
