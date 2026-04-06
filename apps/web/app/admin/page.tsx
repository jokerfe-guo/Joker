import type { Metadata } from 'next'
import { AdminOverviewClient } from '@/components/admin/AdminOverviewClient'

export const metadata: Metadata = { title: 'Overview' }

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Fetch data server-side from our own API
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let overview = { total: 0, topPosts: [] as { slug: string; viewCount: number; likeCount: number }[] }
  let daily: { date: string; views: number }[] = []

  try {
    const [overviewRes, dailyRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/overview`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/analytics/daily?days=30`, { cache: 'no-store' }),
    ])
    if (overviewRes.ok) overview = await overviewRes.json()
    if (dailyRes.ok) daily = await dailyRes.json()
  } catch {
    // D1 not connected yet — show zeros
  }

  return <AdminOverviewClient overview={overview} daily={daily} />
}
