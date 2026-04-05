import { getAllSlugs } from '@/lib/content'

export const dynamic = 'force-static'
export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joker.dev'

function xmlEscape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sitemapUrl(loc: string, lastmod?: string, priority = 0.7) {
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n    <priority>${priority}</priority>\n  </url>`
}

export async function GET() {
  const slugs = await getAllSlugs()
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    sitemapUrl(SITE_URL, today, 1.0),
    sitemapUrl(`${SITE_URL}/blog`, today, 0.9),
    sitemapUrl(`${SITE_URL}/projects`, today, 0.8),
  ]

  const postPages = slugs.map((slug) =>
    sitemapUrl(`${SITE_URL}/blog/${slug}`, undefined, 0.7)
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...postPages].join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
