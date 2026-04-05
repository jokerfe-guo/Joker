import type { PostMeta } from '@/lib/content'
import { groupPostsByMonth } from '@/lib/content'

interface BlogTimelineProps {
  posts: PostMeta[]
  activeTag?: string
}

export function BlogTimeline({ posts, activeTag }: BlogTimelineProps) {
  const grouped = groupPostsByMonth(posts)
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  // Determine the most recent month to highlight as active
  const latestYear = years[0]
  const latestMonth = latestYear
    ? Object.keys(grouped[latestYear])[0]
    : undefined

  return (
    <aside className="blog-timeline glass">
      <div className="blog-line" />

      {activeTag && (
        <div
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--primary)',
            marginBottom: 4,
          }}
        >
          #{activeTag}
        </div>
      )}

      {years.map((year) => (
        <div key={year}>
          <strong style={{ fontSize: '0.9rem' }}>{year}</strong>
          {Object.keys(grouped[year]).map((month) => (
            <div
              key={month}
              className={
                year === latestYear && month === latestMonth
                  ? 'blog-month active'
                  : 'blog-month'
              }
            >
              <span />
              {month}
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}
