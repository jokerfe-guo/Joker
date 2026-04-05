import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GlassNav } from '@/components/glass/GlassNav'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { GiscusComments } from '@/components/blog/GiscusComments'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { getPostBySlug, getAllSlugs } from '@/lib/content'
import { compileMdx } from '@/lib/mdx'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

// ─── Static params for SSG ─────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ─── Metadata ──────────────────────────────────────────
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

// ─── Page ──────────────────────────────────────────────
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { content, headings } = await compileMdx(post.content)

  const date = new Date(post.date)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="screen article-layout-screen">
      <GlassNav />
      <ReadingProgress />

      {/* Two-column layout: article + TOC */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          alignItems: 'flex-start',
        }}
      >
        <article className="glass article-card" style={{ flex: 1, minWidth: 0 }}>
          {/* Tags */}
          <div className="tag-list" style={{ marginBottom: 12 }}>
            {post.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
            {post.title}
          </h2>

          <div className="article-meta">
            <span>{formattedDate}</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Hero panel */}
          <div className="article-hero-panel">
            <div className="article-glow" />
            <div className="article-hero-copy">
              {post.tags.join(' / ')}
            </div>
          </div>

          {/* MDX content */}
          <div
            className="article-prose"
            style={{
              '--tw-prose-body': 'var(--text-muted)',
              '--tw-prose-headings': '#f8fbff',
              '--tw-prose-code': 'var(--primary)',
            } as React.CSSProperties}
          >
            {content}
          </div>

          {/* Comments */}
          <GiscusComments slug={slug} />
        </article>

        {/* Table of contents — hidden on mobile via CSS */}
        <div style={{ display: 'none' }} className="toc-sidebar">
          <TableOfContents headings={headings} />
        </div>
      </div>
    </section>
  )
}
