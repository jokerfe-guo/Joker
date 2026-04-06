import type { Metadata } from 'next'
import { ResumeEditorClient } from '@/components/admin/ResumeEditorClient'
import {
  heroData,
  metricsData,
  skillsData,
  experienceData,
} from '@/lib/resume-data'

export const metadata: Metadata = { title: 'Resume Editor' }
export const dynamic = 'force-dynamic'

// Default resume shape — used as fallback if D1 has no data yet
const defaultSections = {
  hero: heroData,
  metrics: metricsData,
  skills: skillsData,
  experience: experienceData,
}

export default async function AdminResumePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let sections = { ...defaultSections }

  try {
    const res = await fetch(`${baseUrl}/api/admin/resume`, { cache: 'no-store' })
    if (res.ok) {
      const rows: { sectionKey: string; data: unknown }[] = await res.json()
      for (const row of rows) {
        // Merge D1 data over defaults
        const key = row.sectionKey as keyof typeof defaultSections
        if (key in sections) {
          sections = { ...sections, [key]: row.data }
        }
      }
    }
  } catch {
    // D1 not connected — use defaults
  }

  return <ResumeEditorClient sections={sections} />
}
