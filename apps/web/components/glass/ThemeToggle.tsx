'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 8px',
        borderRadius: 10,
        color: 'var(--text-muted)',
        fontSize: '1.1rem',
        lineHeight: 1,
        transition: 'color 200ms ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fbff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
