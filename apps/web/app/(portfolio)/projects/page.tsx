import { GlassNav } from '@/components/glass/GlassNav'

// Phase 2: full project showcase
export default function ProjectsPage() {
  return (
    <section className="screen project-layout-screen">
      <GlassNav />
      <article className="project-modal glass">
        <div className="project-preview">
          <div className="project-preview-shine" />
          <div className="project-preview-frame">Case Study Preview</div>
        </div>
        <div className="project-copy">
          <p className="eyebrow">Featured Project</p>
          <h2>Project Detail Modal Overlay</h2>
          <p className="subdued">
            Full project grid and case studies coming in Phase 2.
          </p>
          <div className="project-stats">
            <div><strong>Role</strong><span>Lead Front-end</span></div>
            <div><strong>Stack</strong><span>React / Motion / WebGL</span></div>
            <div><strong>Impact</strong><span>+28% engagement</span></div>
          </div>
          <div className="hero-actions" style={{ marginTop: 24 }}>
            <button type="button" className="soft-button primary">Open Case Study</button>
            <button type="button" className="soft-button">Close Overlay</button>
          </div>
        </div>
      </article>
    </section>
  )
}
