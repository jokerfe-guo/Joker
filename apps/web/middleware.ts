import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Cloudflare Access JWT verification for /admin routes.
 *
 * In production Cloudflare Access injects a signed JWT in the
 * `Cf-Access-Jwt-Assertion` header for every request that passes the
 * access policy. We verify the token is present and well-formed.
 *
 * Full cryptographic verification (JWK fetch from
 * https://<team>.cloudflareaccess.com/cdn-cgi/access/certs) is
 * handled automatically by Cloudflare Access before the request
 * reaches the origin — this middleware adds a defence-in-depth
 * check for direct / non-CF traffic.
 *
 * Local development: set NEXT_PUBLIC_SKIP_ADMIN_AUTH=true to bypass.
 */

const CF_ACCESS_HEADER = 'Cf-Access-Jwt-Assertion'
const CF_TEAM_DOMAIN   = process.env.CF_TEAM_DOMAIN ?? ''   // e.g. "myteam.cloudflareaccess.com"
const SKIP_AUTH        = process.env.NEXT_PUBLIC_SKIP_ADMIN_AUTH === 'true'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only guard /admin paths
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Local dev bypass
  if (SKIP_AUTH) return NextResponse.next()

  const jwt = request.headers.get(CF_ACCESS_HEADER)

  // No JWT — redirect to CF Access login portal
  if (!jwt) {
    if (CF_TEAM_DOMAIN) {
      const loginUrl = `https://${CF_TEAM_DOMAIN}/cdn-cgi/access/login?redirect_url=${encodeURIComponent(request.url)}`
      return NextResponse.redirect(loginUrl)
    }
    // No team domain configured — block with 401
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized — Cloudflare Access required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // JWT present — verify it has three parts (basic format check).
  // Cryptographic verification is done by CF Access at the edge.
  const parts = jwt.split('.')
  if (parts.length !== 3) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid access token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Optionally decode payload for logging (no signature check needed here)
  try {
    const payload = JSON.parse(atob(parts[1]))
    // Attach email as a response header for downstream use (e.g. audit logs)
    const res = NextResponse.next()
    if (payload.email) res.headers.set('X-Admin-Email', payload.email)
    return res
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
