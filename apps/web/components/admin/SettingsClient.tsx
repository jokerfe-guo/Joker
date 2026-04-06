'use client'

import { useState } from 'react'

interface GiscusConfig { repo: string; repoId: string; category: string; categoryId: string }
interface SocialLinks { github: string; [key: string]: string }
interface Settings {
  site_title: string
  site_description: string
  social_links: SocialLinks
  giscus_config: GiscusConfig
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#f8fbff',
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(222,232,245,0.5)', marginBottom: 6 }}>
        {label}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      {hint && <p style={{ fontSize: '0.72rem', color: 'rgba(222,232,245,0.35)', margin: '6px 0 0' }}>{hint}</p>}
    </div>
  )
}

function SectionCard({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => Promise<void> }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handle = async () => {
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      alert('Save failed — is D1 connected?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass" style={{ borderRadius: 20, padding: '28px 32px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fbff', margin: 0 }}>{title}</h2>
        <button
          type="button"
          onClick={handle}
          disabled={saving}
          className={saved ? 'soft-button primary' : 'soft-button'}
          style={{ fontSize: '0.82rem', padding: '8px 20px' }}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
      {children}
    </div>
  )
}

export function SettingsClient({ settings: init }: { settings: Settings }) {
  const [title, setTitle] = useState(init.site_title)
  const [description, setDescription] = useState(init.site_description)
  const [social, setSocial] = useState<SocialLinks>(init.social_links)
  const [giscus, setGiscus] = useState<GiscusConfig>(init.giscus_config)

  const save = async (key: string, value: unknown) => {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    })
    if (!res.ok) throw new Error('Save failed')
  }

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
        Settings
      </h1>
      <p style={{ color: 'rgba(222,232,245,0.55)', marginBottom: 36, fontSize: '0.875rem' }}>
        Site-wide configuration stored in Cloudflare D1. Changes take effect on next page load.
      </p>

      {/* Site identity */}
      <SectionCard title="Site Identity" onSave={() => save('site_title', title).then(() => save('site_description', description))}>
        <Field label="Site Title" value={title} onChange={setTitle} hint="Used in <title> tags and OpenGraph" />
        <Field label="Site Description" value={description} onChange={setDescription} hint="Used in meta description and RSS feed" />
      </SectionCard>

      {/* Social links */}
      <SectionCard title="Social Links" onSave={() => save('social_links', social)}>
        <Field
          label="GitHub URL"
          value={social.github ?? ''}
          onChange={(v) => setSocial({ ...social, github: v })}
          hint="Shown in hero section and footer"
        />
      </SectionCard>

      {/* Giscus comments */}
      <SectionCard title="Giscus Comments" onSave={() => save('giscus_config', giscus)}>
        <p style={{ fontSize: '0.8rem', color: 'rgba(222,232,245,0.45)', marginBottom: 20 }}>
          Get these values from{' '}
          <a href="https://giscus.app" target="_blank" rel="noreferrer" style={{ color: '#00d4ff' }}>
            giscus.app
          </a>{' '}
          after configuring your GitHub repository.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <Field label="Repo (owner/name)" value={giscus.repo} onChange={(v) => setGiscus({ ...giscus, repo: v })} />
          <Field label="Repo ID" value={giscus.repoId} onChange={(v) => setGiscus({ ...giscus, repoId: v })} />
          <Field label="Category" value={giscus.category} onChange={(v) => setGiscus({ ...giscus, category: v })} />
          <Field label="Category ID" value={giscus.categoryId} onChange={(v) => setGiscus({ ...giscus, categoryId: v })} />
        </div>
      </SectionCard>

      {/* Danger zone hint */}
      <div className="glass" style={{ borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(255,80,80,0.2)' }}>
        <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,120,120,0.7)', margin: '0 0 8px' }}>
          Access Control
        </p>
        <p style={{ color: 'rgba(222,232,245,0.55)', fontSize: '0.85rem', margin: 0 }}>
          This admin is protected by{' '}
          <a href="https://one.dash.cloudflare.com" target="_blank" rel="noreferrer" style={{ color: '#00d4ff' }}>
            Cloudflare Access
          </a>
          . Configure email-based access policies in your Cloudflare Zero Trust dashboard — no passwords needed.
        </p>
      </div>
    </div>
  )
}
