'use client'

import { useEffect, useState } from 'react'

interface LikeButtonProps {
  slug: string
  initialCount?: number
}

export function LikeButton({ slug, initialCount = 0 }: LikeButtonProps) {
  const storageKey = `liked:${slug}`
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Hydrate liked state from localStorage
    setLiked(!!localStorage.getItem(storageKey))

    // Fetch current count
    fetch(`/api/views/${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data: { likeCount?: number }) => {
        if (typeof data.likeCount === 'number') setCount(data.likeCount)
      })
      .catch(() => {})
  }, [slug, storageKey])

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    const newLiked = !liked
    const delta = newLiked ? 1 : -1

    // Optimistic update
    setLiked(newLiked)
    setCount((c) => Math.max(0, c + delta))
    if (newLiked) localStorage.setItem(storageKey, '1')
    else localStorage.removeItem(storageKey)

    try {
      await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      })
    } catch {
      // Revert on failure
      setLiked(!newLiked)
      setCount((c) => Math.max(0, c - delta))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? 'Unlike this post' : 'Like this post'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 20px',
        borderRadius: 40,
        border: liked ? '1px solid rgba(0,212,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
        background: liked
          ? 'rgba(0,212,255,0.1)'
          : 'rgba(255,255,255,0.05)',
        color: liked ? '#00d4ff' : 'rgba(222,232,245,0.68)',
        cursor: loading ? 'default' : 'pointer',
        fontSize: '0.85rem',
        fontFamily: 'inherit',
        fontWeight: 500,
        transition: 'all 200ms ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ fontSize: '1.1em', lineHeight: 1 }}>
        {liked ? '♥' : '♡'}
      </span>
      <span>{count}</span>
    </button>
  )
}
