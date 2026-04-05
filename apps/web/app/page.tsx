import { GlassNav } from '@/components/glass/GlassNav'
import { HeroSection } from '@/components/resume/HeroSection'
import { MetricRow } from '@/components/resume/MetricRow'
import { SkillsCard } from '@/components/resume/SkillsCard'
import { ExperienceCard } from '@/components/resume/ExperienceCard'
import {
  heroData,
  metricsData,
  skillsData,
  experienceData,
} from '@/lib/resume-data'

export default function ResumePage() {
  return (
    <section className="screen">
      <GlassNav />

      <HeroSection data={heroData} />

      <MetricRow metrics={metricsData} />

      <div className="resume-grid">
        <SkillsCard groups={skillsData} />
        <ExperienceCard items={experienceData} />
      </div>
    </section>
  )
}
