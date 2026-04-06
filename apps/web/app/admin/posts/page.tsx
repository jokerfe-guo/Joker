import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { PostsManagerClient } from '@/components/admin/PostsManagerClient'

export const metadata: Metadata = { title: 'Posts' }
export const dynamic = 'force-dynamic'

interface OverviewData {
  topPosts: { slug: string; viewCount: number; likeCount: number }[]
}

export default async function AdminPostsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const posts = await getAllPosts()

  let viewMap: Record<string, { viewCount: number; likeCount: number }> = {}
  let hiddenSlugs: string[] = []

  try {
    const [overviewRes, hiddenRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/overview`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/posts/hidden`, { cache: 'no-store' }),
    ])
    if (overviewRes.ok) {
      const data = await overviewRes.json() as OverviewData
      for (const p of data.topPosts) viewMap[p.slug] = { viewCount: p.viewCount, likeCount: p.likeCount }
    }
    if (hiddenRes.ok) hiddenSlugs = await hiddenRes.json() as string[]
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
