'use client'

import { useState } from 'react'
import type { Project } from '@/lib/projects-data'
import { ProjectModal } from './ProjectModal'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="glass blog-card"
        style={{
          textAlign: 'left',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          width: '100%',
          display: 'block',
        }}
        onClick={() => setOpen(true)}
      >
        {/* Preview area */}
        <div
          className="project-preview"
          style={{ borderRadius: '20px 20px 0 0', height: 140 }}
        >
          <div className="project-preview-shine" />
          <div className="project-preview-frame">
            {project.previewLabel ?? project.title}
          </div>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {/* Tags */}
          <div className="tag-list" style={{ marginBottom: 10 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <h3 style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 6px',
            color: '#f8fbff',
          }}>
            {project.title}
          </h3>

          <p className="subdued" style={{ fontSize: '0.85rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            {project.description.slice(0, 120)}…
          </p>

          <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem' }}>
            <span className="subdued"><strong style={{ color: '#f8fbff' }}>Impact</strong> {project.impact}</span>
            <span className="subdued"><strong style={{ color: '#f8fbff' }}>Year</strong> {project.period}</span>
          </div>
        </div>
      </button>

      {open && <ProjectModal project={project} onClose={() => setOpen(false)} />}
    </>
  )
}
