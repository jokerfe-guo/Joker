import type { Metadata } from 'next'
import { AdminOverviewClient } from '@/components/admin/AdminOverviewClient'
import type { OverviewData, DailyStat } from '@/lib/admin-types'

export const metadata: Metadata = { title: 'Overview' }
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let overview: OverviewData = { total: 0, topPosts: [] }
  let daily: DailyStat[] = []

  try {
    const [overviewRes, dailyRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/analytics/overview`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/analytics/daily?days=30`, { cache: 'no-store' }),
    ])
    if (overviewRes.ok) overview = await overviewRes.json() as OverviewData
    if (dailyRes.ok) daily = await dailyRes.json() as DailyStat[]
  } catch {
    // D1 not connected yet — show zeros
  }

  return <AdminOverviewClient overview={overview} daily={daily} />
}
