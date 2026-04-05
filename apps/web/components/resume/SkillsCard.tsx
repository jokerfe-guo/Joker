import { GlassCard } from '@/components/glass/GlassCard'

interface SkillsCardProps {
  groups: string[][]
}

export function SkillsCard({ groups }: SkillsCardProps) {
  return (
    <GlassCard className="content-card">
      <p className="eyebrow">Skills</p>
      <h3>Interface engineering with aesthetic discipline.</h3>
      <div className="skill-columns">
        {groups.map((group) => (
          <div key={group.join('-')} className="skill-stack">
            {group.map((skill) => (
              <span key={skill} className="skill-tile">
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
