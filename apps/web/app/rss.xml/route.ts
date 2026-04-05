import { Feed } from 'feed'
import { getAllPosts } from '@/lib/content'

export const dynamic = 'force-static'
export const revalidate = 3600 // 1 hour

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joker.dev'
const AUTHOR = {
  name: 'Joker',
  email: 'hello@joker.dev',
  link: SITE_URL,
}

export async function GET() {
  const posts = await getAllPosts()

  const feed = new Feed({
    title: 'Joker.AI — Tech Blog',
    description: 'Front-end engineering, UI physics, and modern web architecture.',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    image: `${SITE_URL}/og-image.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Joker`,
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
    },
    author: AUTHOR,
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.description,
      author: [AUTHOR],
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
    })
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
