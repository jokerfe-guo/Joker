'use client'

import { useEffect } from 'react'
import type { Project } from '@/lib/projects-data'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'rgba(10,10,20,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal card */}
      <article
        className="project-modal glass"
        style={{ maxWidth: 820, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Preview strip */}
        <div className="project-preview" style={{ borderRadius: '20px 20px 0 0', height: 180, flexShrink: 0 }}>
          <div className="project-preview-shine" />
          <div className="project-preview-frame">
            {project.previewLabel ?? project.title}
          </div>
        </div>

        {/* Copy */}
        <div className="project-copy" style={{ padding: '32px 40px 40px' }}>
          {/* Tags */}
          <div className="tag-list" style={{ marginBottom: 16 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <p className="eyebrow">{project.period}</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', margin: '4px 0 20px' }}>
            {project.title}
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28, maxWidth: 600 }}>
            {project.description}
          </p>

          {/* Stats */}
          <div className="project-stats">
            <div>
              <strong>Role</strong>
              <span>{project.role}</span>
            </div>
            <div>
              <strong>Stack</strong>
              <span>{project.stack}</span>
            </div>
            <div>
              <strong>Impact</strong>
              <span>{project.impact}</span>
            </div>
          </div>

          <div className="hero-actions" style={{ marginTop: 28 }}>
            <button type="button" className="soft-button primary" onClick={onClose}>
              Close Case Study
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
