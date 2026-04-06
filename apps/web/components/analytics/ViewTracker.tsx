'use client'

import { useEffect } from 'react'

/**
 * Invisible component — fires POST /api/views/:slug once per page load.
 * Mount this inside the article detail page.
 */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire-and-forget; ignore errors (e.g. D1 not available in dev)
    fetch(`/api/views/${encodeURIComponent(slug)}`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
