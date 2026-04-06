import type { Metadata } from 'next'
import { SettingsClient } from '@/components/admin/SettingsClient'

export const metadata: Metadata = { title: 'Settings' }
export const dynamic = 'force-dynamic'

interface GiscusConfig { repo: string; repoId: string; category: string; categoryId: string }
interface SocialLinks { github: string }
interface Settings {
  site_title: string
  site_description: string
  social_links: SocialLinks
  giscus_config: GiscusConfig
}

const defaults: Settings = {
  site_title: 'Joker.AI',
  site_description: 'Crafting high-performance digital experiences.',
  social_links: { github: 'https://github.com/jokerfe-guo' },
  giscus_config: { repo: '', repoId: '', category: '', categoryId: '' },
}

export default async function AdminSettingsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  let settings: Settings = { ...defaults }

  try {
    const res = await fetch(`${baseUrl}/api/admin/settings`, { cache: 'no-store' })
    if (res.ok) {
      const remote = await res.json() as Partial<Settings>
      settings = { ...settings, ...remote }
    }
  } catch {
    // D1 not connected
  }

  return <SettingsClient settings={settings} />
}
