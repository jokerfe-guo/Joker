import type { Metadata } from 'next'
import { AnalyticsClient } from '@/components/admin/AnalyticsClient'
import type { DailyStat, TopPost, OverviewData } from '@/lib/admin-types'

export const metadata: Metadata = { title: 'Analytics' }
export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let daily7: DailyStat[] = []
  let daily30: DailyStat[] = []
  let topPosts: TopPost[] = []

  try {
    const [d7Res, d30Res, overviewRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/daily?days=7`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/analytics/daily?days=30`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/analytics/overview`, { cache: 'no-store' }),
    ])
    if (d7Res.ok) daily7 = await d7Res.json() as DailyStat[]
    if (d30Res.ok) daily30 = await d30Res.json() as DailyStat[]
    if (overviewRes.ok) {
      const data = await overviewRes.json() as OverviewData
      topPosts = data.topPosts ?? []
    }
  } catch {
    // D1 not connected
  }

  return <AnalyticsClient daily7={daily7} daily30={daily30} topPosts={topPosts} />
}
