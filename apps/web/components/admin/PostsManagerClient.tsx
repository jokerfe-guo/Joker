'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PostRow {
  slug: string
  title: string
  date: string
  tags: string[]
  readingTime: string
  viewCount: number
  likeCount: number
  hidden: boolean
}

export function PostsManagerClient({ posts: initial }: { posts: PostRow[] }) {
  const [posts, setPosts] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)

  const toggleHidden = async (slug: string) => {
    setSaving(slug)
    const updated = posts.map((p) =>
      p.slug === slug ? { ...p, hidden: !p.hidden } : p
    )
    setPosts(updated)

    try {
      await fetch('/api/admin/posts/hidden', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: updated.filter((p) => p.hidden).map((p) => p.slug) }),
      })
    } catch {
      // revert on failure
      setPosts(posts)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
        Posts
      </h1>
      <p style={{ color: 'rgba(222,232,245,0.55)', marginBottom: 32, fontSize: '0.875rem' }}>
        {posts.length} posts in content/posts — toggle visibility or jump to the article.
      </p>

      <div className="glass" style={{ borderRadius: 20, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(222,232,245,0.5)',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '14px 20px', fontWeight: 500 }}>Title</th>
              <th style={{ padding: '14px 12px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '14px 12px', fontWeight: 500, textAlign: 'right' }}>Views</th>
              <th style={{ padding: '14px 12px', fontWeight: 500, textAlign: 'right' }}>Likes</th>
              <th style={{ padding: '14px 12px', fontWeight: 500 }}>Read</th>
              <th style={{ padding: '14px 20px', fontWeight: 500, textAlign: 'center' }}>Visible</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr
                key={p.slug}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  opacity: p.hidden ? 0.45 : 1,
                  transition: 'opacity 200ms ease',
                }}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div>
                    <span style={{ color: '#f8fbff', fontWeight: 500 }}>{p.title}</span>
                    <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {p.tags.map((t) => (
                        <span key={t} className="tag-chip" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 12px', color: 'rgba(222,232,245,0.55)', whiteSpace: 'nowrap' }}>
                  {p.date}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#00d4ff', fontWeight: 600 }}>
                  {p.viewCount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 12px', textAlign: 'right', color: 'rgba(222,232,245,0.55)' }}>
                  {p.likeCount}
                </td>
                <td style={{ padding: '14px 12px', color: 'rgba(222,232,245,0.45)', fontSize: '0.8rem' }}>
                  {p.readingTime}
                </td>
                <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => toggleHidden(p.slug)}
                    disabled={saving === p.slug}
                    aria-label={p.hidden ? 'Make visible' : 'Hide post'}
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      border: 'none',
                      cursor: saving === p.slug ? 'default' : 'pointer',
                      background: p.hidden ? 'rgba(255,255,255,0.12)' : 'rgba(0,212,255,0.35)',
                      position: 'relative',
                      transition: 'background 200ms ease',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 3,
                        left: p.hidden ? 3 : 21,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: p.hidden ? 'rgba(222,232,245,0.4)' : '#00d4ff',
                        transition: 'left 200ms ease, background 200ms ease',
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 20, fontSize: '0.78rem', color: 'rgba(222,232,245,0.35)' }}>
        Note: hiding a post removes it from the blog listing but does not unpublish its URL. Re-deploy after toggling to apply at the edge.
      </p>
    </div>
  )
}
