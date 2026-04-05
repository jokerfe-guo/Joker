import { GlassCard } from '@/components/glass/GlassCard'

interface Experience {
  role: string
  company: string
  time: string
  body: string
}

interface ExperienceCardProps {
  items: Experience[]
}

export function ExperienceCard({ items }: ExperienceCardProps) {
  return (
    <GlassCard className="content-card">
      <p className="eyebrow">Experience</p>
      <div className="timeline-stack">
        {items.map((item) => (
          <div key={item.role} className="timeline-item">
            <div className="timeline-node" />
            <div>
              <strong>{item.role}</strong>
              <span>
                {item.company} • {item.time}
              </span>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
