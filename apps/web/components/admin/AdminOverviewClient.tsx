'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TopPost, DailyStat, OverviewData } from '@/lib/admin-types'

interface Props {
  overview: OverviewData
  daily: DailyStat[]
}

export function AdminOverviewClient({ overview, daily }: Props) {
  const last7 = daily.slice(-7).reduce((s, d) => s + (d.views ?? 0), 0)
  const last30 = daily.reduce((s, d) => s + (d.views ?? 0), 0)

  return (
    <div>
      {/* Page header */}
      <p className="eyebrow">Admin</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 32 }}>
        Overview
      </h1>

      {/* Stat tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          { label: 'Total Views', value: overview.total.toLocaleString() },
          { label: 'Last 7 days', value: last7.toLocaleString() },
          { label: 'Last 30 days', value: last30.toLocaleString() },
          { label: 'Posts tracked', value: overview.topPosts.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass metric-a"
            style={{ padding: '20px 24px', borderRadius: 16, textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: 0 }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0 0', color: '#f8fbff' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass" style={{ borderRadius: 20, padding: '28px 24px', marginBottom: 40 }}>
        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: '0 0 20px' }}>
          Daily Views — Last 30 Days
        </p>
        {daily.length === 0 ? (
          <p style={{ color: 'rgba(222,232,245,0.4)', textAlign: 'center', padding: '40px 0' }}>
            No data yet — views will appear here once your site receives traffic.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={daily} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(222,232,245,0.45)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => v.slice(5)} // MM-DD
              />
              <YAxis
                tick={{ fill: 'rgba(222,232,245,0.45)', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10,16,32,0.92)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  fontSize: 13,
                }}
                labelStyle={{ color: '#00d4ff' }}
                itemStyle={{ color: '#f8fbff' }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#00d4ff"
                strokeWidth={2}
                fill="url(#viewGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top posts table */}
      <div className="glass" style={{ borderRadius: 20, padding: '28px 24px' }}>
        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: '0 0 20px' }}>
          Top Posts
        </p>
        {overview.topPosts.length === 0 ? (
          <p style={{ color: 'rgba(222,232,245,0.4)', padding: '20px 0' }}>
            No post data yet.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ color: 'rgba(222,232,245,0.45)', textAlign: 'left' }}>
                <th style={{ paddingBottom: 12, fontWeight: 500 }}>Slug</th>
                <th style={{ paddingBottom: 12, fontWeight: 500, textAlign: 'right' }}>Views</th>
                <th style={{ paddingBottom: 12, fontWeight: 500, textAlign: 'right' }}>Likes</th>
              </tr>
            </thead>
            <tbody>
              {overview.topPosts.map((p, i) => (
                <tr
                  key={p.slug}
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    color: i === 0 ? '#f8fbff' : 'rgba(222,232,245,0.75)',
                  }}
                >
                  <td style={{ padding: '10px 0' }}>/blog/{p.slug}</td>
                  <td style={{ textAlign: 'right', padding: '10px 0', color: '#00d4ff', fontWeight: 600 }}>
                    {p.viewCount.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 0' }}>
                    {p.likeCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
