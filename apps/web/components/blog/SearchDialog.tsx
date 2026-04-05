'use client'

import { useEffect, useRef, useState } from 'react'

interface SearchResult {
  url: string
  meta: { title: string }
  excerpt: string
}

export function SearchTrigger() {
  const [open, setOpen] = useState(false)

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="search-shell glass"
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search articles…</span>
        <kbd style={{ marginLeft: 'auto', fontSize: '0.68rem', opacity: 0.5, fontFamily: 'monospace' }}>⌘K</kbd>
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }

    // Pagefind search — available after build
    // Falls back gracefully in dev mode
    const search = async () => {
      try {
        // @ts-ignore — pagefind is loaded as a static asset after build
        const pagefind = await import('/pagefind/pagefind.js')
        const res = await pagefind.search(query)
        const data = await Promise.all(res.results.slice(0, 8).map((r: { data: () => Promise<SearchResult> }) => r.data()))
        setResults(data)
      } catch {
        setResults([])
      }
    }

    const timer = setTimeout(search, 200)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(2,4,10,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '80px 20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass"
        style={{ width: '100%', maxWidth: 600, borderRadius: 24, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--glass-border)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: '1rem', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '4px 8px', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {results.length === 0 && query.trim() && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No results for "{query}"
            </div>
          )}
          {results.length === 0 && !query.trim() && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Start typing to search all posts…
            </div>
          )}
          {results.map((result) => (
            <a
              key={result.url}
              href={result.url}
              onClick={onClose}
              style={{
                display: 'block', padding: '16px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                textDecoration: 'none', transition: '180ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
                {result.meta?.title}
              </div>
              <div
                style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
