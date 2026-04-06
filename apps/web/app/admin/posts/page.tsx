import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { PostsManagerClient } from '@/components/admin/PostsManagerClient'

export const metadata: Metadata = { title: 'Posts' }
export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  // Get all posts from filesystem
  const posts = await getAllPosts()

  // Get view counts from D1
  let viewMap: Record<string, { viewCount: number; likeCount: number }> = {}
  let hiddenSlugs: string[] = []

  try {
    const [overviewRes, hiddenRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/overview`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/posts/hidden`, { cache: 'no-store' }),
    ])
    if (overviewRes.ok) {
      const data: { topPosts: { slug: string; viewCount: number; likeCount: number }[] } = await overviewRes.json()
      for (const p of data.topPosts) viewMap[p.slug] = { viewCount: p.viewCount, likeCount: p.likeCount }
    }
    if (hiddenRes.ok) hiddenSlugs = await hiddenRes.json()
  } catch {
    // D1 not connected
  }

  const enriched = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    tags: p.tags,
    readingTime: p.readingTime,
    viewCount: viewMap[p.slug]?.viewCount ?? 0,
    likeCount: viewMap[p.slug]?.likeCount ?? 0,
    hidden: hiddenSlugs.includes(p.slug),
  }))

  return <PostsManagerClient posts={enriched} />
}
