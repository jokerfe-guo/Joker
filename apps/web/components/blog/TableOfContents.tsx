'use client'

import { useEffect, useRef, useState } from 'react'
import type { Heading } from '@/lib/mdx'

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0.1 },
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      style={{
        position: 'sticky',
        top: 100,
        width: 200,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <p className="eyebrow" style={{ marginBottom: 10 }}>Contents</p>
      {headings
        .filter((h) => h.level <= 3)
        .map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            style={{
              fontSize: '0.82rem',
              lineHeight: 1.4,
              paddingLeft: heading.level === 2 ? 0 : heading.level === 3 ? 12 : 0,
              color: activeId === heading.id ? 'var(--primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              transition: '180ms ease',
              borderLeft: activeId === heading.id
                ? '2px solid var(--primary)'
                : '2px solid transparent',
              paddingLeft: (heading.level - 2) * 12 + 8,
            }}
          >
            {heading.text}
          </a>
        ))}
    </nav>
  )
}
