import { GlassNav } from '@/components/glass/GlassNav'

// Phase 2: full blog listing with Obsidian content + Pagefind search
export default function BlogPage() {
  return (
    <section className="screen blog-layout-screen">
      <GlassNav />
      <header className="blog-header">
        <div>
          <p className="eyebrow">DevLog v2.0.0</p>
          <h2>Tech Blog</h2>
          <p className="subdued">Front-end engineering, UI physics, and modern web architecture.</p>
        </div>
        <div className="search-shell glass">Search articles…</div>
      </header>
      <div className="blog-grid">
        <aside className="blog-timeline glass">
          <div className="blog-line" />
          <strong>2024</strong>
          {['October', 'August', 'June', 'May'].map((month, i) => (
            <div key={month} className={i === 0 ? 'blog-month active' : 'blog-month'}>
              <span />
              {month}
            </div>
          ))}
          <strong className="muted-year">2023</strong>
        </aside>
        <div className="blog-feed">
          <p className="subdued" style={{ padding: '24px 0' }}>
            Posts load here in Phase 2 — connect your Obsidian vault.
          </p>
        </div>
      </div>
    </section>
  )
}
