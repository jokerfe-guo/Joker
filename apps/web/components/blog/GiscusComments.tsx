'use client'

import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  slug: string
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
  // These values are configured in /admin/settings after Phase 3
  // Populate from your actual GitHub repo once Giscus is set up:
  // 1. Enable Discussions on your blog GitHub repo
  // 2. Visit https://giscus.app and generate config
  // 3. Update these values or load from site_settings in Phase 3
  const repo = (process.env.NEXT_PUBLIC_GISCUS_REPO ?? '') as `${string}/${string}`
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General'
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''

  if (!repo || !repoId) {
    return (
      <div
        className="glass"
        style={{ borderRadius: 20, padding: '24px', marginTop: 32, textAlign: 'center' }}
      >
        <p className="subdued" style={{ fontSize: '0.88rem' }}>
          Comments are not configured yet.{' '}
          <a
            href="https://giscus.app"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--primary)' }}
          >
            Set up Giscus
          </a>{' '}
          and add your credentials to <code>.env.local</code>.
        </p>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 32 }}>
      <Giscus
        id={`giscus-${slug}`}
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="dark_dimmed"
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
