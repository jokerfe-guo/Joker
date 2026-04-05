import { Suspense } from 'react'
import type { Metadata } from 'next'
import { GlassNav } from '@/components/glass/GlassNav'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogTimeline } from '@/components/blog/BlogTimeline'
import { TagCloud } from '@/components/blog/TagCloud'
import { SearchTrigger } from '@/components/blog/SearchDialog'
import { getAllPosts, getAllTags } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Front-end engineering, UI physics, and modern web architecture.',
}

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams
  const [posts, tags] = await Promise.all([getAllPosts(tag), getAllTags()])

  return (
    <section className="screen blog-layout-screen">
      <GlassNav />

      <header className="blog-header">
        <div>
          <p className="eyebrow">DevLog v2.0.0</p>
          <h2>Tech Blog</h2>
          <p className="subdued">
            Front-end engineering, UI physics, and modern web architecture.
          </p>
          {/* Tag filter */}
          {tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Suspense>
                <TagCloud tags={tags} activeTag={tag} />
              </Suspense>
            </div>
          )}
        </div>

        <Suspense>
          <SearchTrigger />
        </Suspense>
      </header>

      <div className="blog-grid">
        <BlogTimeline posts={posts} activeTag={tag} />

        <div className="blog-feed">
          {posts.length === 0 ? (
            <div className="glass blog-card" style={{ textAlign: 'center', padding: 40 }}>
              <p className="subdued">
                {tag
                  ? `No posts tagged "${tag}" yet.`
                  : 'No posts yet — write your first Obsidian note and push to GitHub.'}
              </p>
            </div>
          ) : (
            posts.map((post) => <BlogCard key={post.slug} post={post} />)
          )}
        </div>
      </div>
    </section>
  )
}
