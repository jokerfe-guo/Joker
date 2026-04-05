import { GlassNav } from '@/components/glass/GlassNav'

// Phase 2: full MDX article renderer
export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <section className="screen article-layout-screen">
      <GlassNav />
      <div className="progress-track">
        <div className="progress-fill" />
      </div>
      <article className="glass article-card">
        <p className="eyebrow">Article</p>
        <h2>{params.slug}</h2>
        <p className="subdued">Full MDX rendering coming in Phase 2.</p>
      </article>
    </section>
  )
}
