import Link from 'next/link'
import type { PostMeta } from '@/lib/content'

interface BlogCardProps {
  post: PostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.date)
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const meta = `${month} ${day} • ${post.readingTime.toUpperCase()}`

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="glass blog-card" style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
        <div className="blog-card-meta">
          <div className="tag-list">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
          <span className="subdued" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            {meta}
          </span>
        </div>
        <h3>{post.title}</h3>
        <p className="subdued" style={{ marginTop: 10, fontSize: '0.95rem', lineHeight: 1.6 }}>
          {post.description}
        </p>
      </article>
    </Link>
  )
}
