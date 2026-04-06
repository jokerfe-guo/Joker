'use client'

import { useState } from 'react'

// ─── Types matching resume-data.ts ────────────────────────────────────────
interface HeroData {
  name: string
  title: string
  company: string
  bio: string
  avatar: string
  github: string
}

interface MetricItem { value: string; label: string }
interface ExperienceItem { role: string; company: string; time: string; body: string }

interface Sections {
  hero: HeroData
  metrics: MetricItem[]
  skills: string[][]
  experience: ExperienceItem[]
}

// ─── Save helper ──────────────────────────────────────────────────────────
async function saveSection(key: string, data: unknown) {
  const res = await fetch(`/api/admin/resume/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
  if (!res.ok) throw new Error('Save failed')
}

// ─── Shared save button ───────────────────────────────────────────────────
function SaveBtn({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={saved ? 'soft-button primary' : 'soft-button'}
      style={{ fontSize: '0.82rem', padding: '8px 20px' }}
    >
      {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
    </button>
  )
}

// ─── Section shell ────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  onSave,
  children,
}: {
  title: string
  subtitle?: string
  onSave: () => Promise<void>
  children: React.ReactNode
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handle = async () => {
    setSaving(true)
    setSaved(false)
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
    <div
      className="glass"
      style={{ borderRadius: 20, padding: '28px 32px', marginBottom: 24 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#00d4ff',
              margin: 0,
            }}
          >
            Section
          </p>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              margin: '4px 0 0',
              color: '#f8fbff',
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: 'rgba(222,232,245,0.5)', margin: '4px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
        <SaveBtn saving={saving} saved={saved} onClick={handle} />
      </div>
      {children}
    </div>
  )
}

// ─── Field components ─────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#f8fbff',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: multiline ? 'vertical' : 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'rgba(222,232,245,0.5)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={sharedStyle}
        />
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════
export function ResumeEditorClient({ sections: init }: { sections: Sections }) {
  const [hero, setHero] = useState<HeroData>(init.hero)
  const [metrics, setMetrics] = useState<MetricItem[]>(init.metrics)
  const [skills, setSkills] = useState<string[][]>(init.skills)
  const [experience, setExperience] = useState<ExperienceItem[]>(init.experience)

  // ── Metrics helpers ───────────────────────────────────────────────────
  const updateMetric = (i: number, field: keyof MetricItem, val: string) => {
    setMetrics((prev) => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }
  const addMetric = () => setMetrics((prev) => [...prev, { value: '', label: '' }])
  const removeMetric = (i: number) => setMetrics((prev) => prev.filter((_, idx) => idx !== i))

  // ── Skills helpers ────────────────────────────────────────────────────
  const updateSkillRow = (rowIdx: number, colIdx: number, val: string) => {
    setSkills((prev) =>
      prev.map((row, r) =>
        r === rowIdx ? row.map((s, c) => c === colIdx ? val : s) : row
      )
    )
  }
  const addSkillRow = () => setSkills((prev) => [...prev, ['', '', '']])
  const removeSkillRow = (i: number) => setSkills((prev) => prev.filter((_, idx) => idx !== i))

  // ── Experience helpers ────────────────────────────────────────────────
  const updateExp = (i: number, field: keyof ExperienceItem, val: string) => {
    setExperience((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }
  const addExp = () =>
    setExperience((prev) => [...prev, { role: '', company: '', time: '', body: '' }])
  const removeExp = (i: number) =>
    setExperience((prev) => prev.filter((_, idx) => idx !== i))

  const addBtn: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 8,
    border: '1px dashed rgba(0,212,255,0.35)',
    background: 'transparent',
    color: '#00d4ff',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 8,
  }

  const removeBtn: React.CSSProperties = {
    background: 'rgba(255,80,80,0.1)',
    border: '1px solid rgba(255,80,80,0.2)',
    borderRadius: 8,
    color: 'rgba(255,120,120,0.9)',
    cursor: 'pointer',
    fontSize: '0.78rem',
    padding: '4px 10px',
    fontFamily: 'inherit',
    flexShrink: 0,
    alignSelf: 'center',
  }

  return (
    <div>
      <p className="eyebrow">Admin</p>
      <h1
        style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 8,
        }}
      >
        Resume Editor
      </h1>
      <p style={{ color: 'rgba(222,232,245,0.55)', marginBottom: 36, fontSize: '0.875rem' }}>
        Changes save to Cloudflare D1 and are reflected on the front-end after the next page load.
      </p>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <SectionCard
        title="Hero"
        subtitle="Name, title, bio shown on the resume landing page"
        onSave={() => saveSection('hero', hero)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ paddingRight: 16 }}>
            <Field label="Name"    value={hero.name}    onChange={(v) => setHero({ ...hero, name: v })} />
            <Field label="Title"   value={hero.title}   onChange={(v) => setHero({ ...hero, title: v })} />
            <Field label="Company" value={hero.company} onChange={(v) => setHero({ ...hero, company: v })} />
          </div>
          <div style={{ paddingLeft: 16 }}>
            <Field label="GitHub URL" value={hero.github} onChange={(v) => setHero({ ...hero, github: v })} />
            <Field label="Avatar path" value={hero.avatar} onChange={(v) => setHero({ ...hero, avatar: v })} />
          </div>
        </div>
        <Field
          label="Bio"
          value={hero.bio}
          onChange={(v) => setHero({ ...hero, bio: v })}
          multiline
        />
      </SectionCard>

      {/* ── METRICS ────────────────────────────────────────────────────── */}
      <SectionCard
        title="Metrics"
        subtitle="Key numbers displayed in the stats row"
        onSave={() => saveSection('metrics', metrics)}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-end',
              marginBottom: 12,
              background: 'rgba(255,255,255,0.03)',
              padding: '12px 16px',
              borderRadius: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <Field label="Value" value={m.value} onChange={(v) => updateMetric(i, 'value', v)} />
            </div>
            <div style={{ flex: 2 }}>
              <Field label="Label" value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
            </div>
            <button style={removeBtn} onClick={() => removeMetric(i)}>Remove</button>
          </div>
        ))}
        <button style={addBtn} onClick={addMetric}>+ Add metric</button>
      </SectionCard>

      {/* ── SKILLS ─────────────────────────────────────────────────────── */}
      <SectionCard
        title="Skills"
        subtitle="Each row is a group of 3 skills displayed side-by-side"
        onSave={() => saveSection('skills', skills)}
      >
        {skills.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 10,
              background: 'rgba(255,255,255,0.03)',
              padding: '12px 16px',
              borderRadius: 12,
              alignItems: 'flex-end',
            }}
          >
            {row.map((skill, colIdx) => (
              <div key={colIdx} style={{ flex: 1 }}>
                <Field
                  label={`Skill ${colIdx + 1}`}
                  value={skill}
                  onChange={(v) => updateSkillRow(rowIdx, colIdx, v)}
                />
              </div>
            ))}
            <button style={removeBtn} onClick={() => removeSkillRow(rowIdx)}>Remove row</button>
          </div>
        ))}
        <button style={addBtn} onClick={addSkillRow}>+ Add skill row</button>
      </SectionCard>

      {/* ── EXPERIENCE ─────────────────────────────────────────────────── */}
      <SectionCard
        title="Experience"
        subtitle="Timeline entries shown in chronological order (latest first)"
        onSave={() => saveSection('experience', experience)}
      >
        {experience.map((exp, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '16px 20px',
              borderRadius: 14,
              marginBottom: 16,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'rgba(222,232,245,0.4)',
                }}
              >
                Experience #{i + 1}
              </span>
              <button style={removeBtn} onClick={() => removeExp(i)}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
              <Field label="Role"    value={exp.role}    onChange={(v) => updateExp(i, 'role', v)} />
              <Field label="Company" value={exp.company} onChange={(v) => updateExp(i, 'company', v)} />
              <Field label="Period"  value={exp.time}    onChange={(v) => updateExp(i, 'time', v)} />
            </div>
            <Field label="Description" value={exp.body} onChange={(v) => updateExp(i, 'body', v)} multiline />
          </div>
        ))}
        <button style={addBtn} onClick={addExp}>+ Add experience</button>
      </SectionCard>
    </div>
  )
}
