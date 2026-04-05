import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Phase 3: import and register all routes
// import { viewsRoutes } from './routes/views'
// import { analyticsRoutes } from './routes/analytics'
// import { adminRoutes } from './routes/admin'

const app = new Hono()

app.use('*', cors())

app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default app
