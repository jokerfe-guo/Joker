'use client'

import { useState } from 'react'
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

interface DailyStat { date: string; views: number }
interface TopPost { slug: string; viewCount: number; likeCount: number }

interface Props {
  daily7: DailyStat[]
  daily30: DailyStat[]
  topPosts: TopPost[]
}

const CHART_STYLE = {
  contentStyle: {
    background: 'rgba(10,16,32,0.92)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    fontSize: 13,
  },
  labelStyle: { color: '#00d4ff' },
  itemStyle: { color: '#f8fbff' },
}

export function AnalyticsClient({ daily7, daily30, topPosts }: Props) {
  const [period, setPeriod] = useState<'7' | '30'>('30')
  const data = period === '7' ? daily7 : daily30

  const total = data.reduce((s, d) => s + (d.views ?? 0), 0)
  const peak = data.reduce((m, d) => Math.max(m, d.views ?? 0), 0)

  const empty = (
    <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(222,232,245,0.35)', fontSize: '0.875rem' }}>
      No data yet — views appear here once your site receives traffic.
    </div>
  )

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 32 }}>
        Analytics
      </h1>

      {/* Period toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['7', '30'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={period === p ? 'switch-pill active' : 'switch-pill'}
            style={{ fontSize: '0.8rem', padding: '6px 16px' }}
          >
            Last {p} days
          </button>
        ))}
      </div>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: `Total Views (${period}d)`, value: total.toLocaleString() },
          { label: 'Peak Day', value: peak.toLocaleString() },
          { label: 'Posts Tracked', value: topPosts.length },
        ].map((s) => (
          <div key={s.label} className="glass metric-a" style={{ padding: '18px 22px', borderRadius: 14, textAlign: 'center' }}>
            <p style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: 0 }}>
              {s.label}
            </p>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: '6px 0 0', color: '#f8fbff' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="glass" style={{ borderRadius: 20, padding: '28px 24px', marginBottom: 28 }}>
        <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: '0 0 20px' }}>
          Daily Views
        </p>
        {data.length === 0 ? empty : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: 'rgba(222,232,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fill: 'rgba(222,232,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip {...CHART_STYLE} />
              <Area type="monotone" dataKey="views" stroke="#00d4ff" strokeWidth={2} fill="url(#aGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top posts bar chart */}
      <div className="glass" style={{ borderRadius: 20, padding: '28px 24px', marginBottom: 28 }}>
        <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: '0 0 20px' }}>
          Views by Post
        </p>
        {topPosts.length === 0 ? empty : (
          <ResponsiveContainer width="100%" height={Math.max(160, topPosts.length * 36)}>
            <BarChart
              data={topPosts.map((p) => ({ slug: p.slug.replace(/-/g, ' '), views: p.viewCount }))}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(222,232,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="slug" width={160} tick={{ fill: 'rgba(222,232,245,0.6)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip {...CHART_STYLE} />
              <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                {topPosts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? '#00d4ff' : `rgba(0,212,255,${Math.max(0.2, 0.7 - i * 0.08)})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Likes ranking */}
      {topPosts.length > 0 && (
        <div className="glass" style={{ borderRadius: 20, padding: '28px 24px' }}>
          <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#00d4ff', margin: '0 0 20px' }}>
            Most Liked Posts
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ color: 'rgba(222,232,245,0.4)', textAlign: 'left' }}>
                <th style={{ paddingBottom: 12, fontWeight: 500 }}>Post</th>
                <th style={{ paddingBottom: 12, fontWeight: 500, textAlign: 'right' }}>♥ Likes</th>
                <th style={{ paddingBottom: 12, fontWeight: 500, textAlign: 'right' }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {[...topPosts].sort((a, b) => b.likeCount - a.likeCount).map((p) => (
                <tr key={p.slug} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '10px 0', color: '#f8fbff' }}>/blog/{p.slug}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: '#c084fc', fontWeight: 600 }}>{p.likeCount}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: 'rgba(222,232,245,0.5)' }}>{p.viewCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
