import type { Metadata } from 'next'
import { GlassNav } from '@/components/glass/GlassNav'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { projectsData } from '@/lib/projects-data'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Case studies in front-end architecture, design systems, and interactive engineering.',
}

export default function ProjectsPage() {
  const featured = projectsData.filter((p) => p.featured)
  const rest = projectsData.filter((p) => !p.featured)

  return (
    <section className="screen blog-layout-screen">
      <GlassNav />

      {/* Header */}
      <header className="blog-header" style={{ marginBottom: 40 }}>
        <div>
          <p className="eyebrow">Case Studies</p>
          <h2>Projects</h2>
          <p className="subdued" style={{ maxWidth: 480 }}>
            Front-end architecture, design systems, and interactive engineering — built for scale and craft.
          </p>
        </div>
      </header>

      {/* Featured projects */}
      {featured.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Featured</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 24,
            }}
          >
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* All other projects */}
      {rest.length > 0 && (
        <div>
          <p className="eyebrow" style={{ marginBottom: 20 }}>More Work</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}
          >
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
