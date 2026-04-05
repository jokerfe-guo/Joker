'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface TagCloudProps {
  tags: string[]
  activeTag?: string
}

export function TagCloud({ tags, activeTag }: TagCloudProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('tag') === tag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="tag-list" style={{ flexWrap: 'wrap', gap: 8 }}>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => handleTag(tag)}
          className="tag-chip"
          style={{
            cursor: 'pointer',
            background: activeTag === tag ? 'rgba(0,212,255,0.18)' : undefined,
            borderColor: activeTag === tag ? 'rgba(0,212,255,0.4)' : undefined,
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
