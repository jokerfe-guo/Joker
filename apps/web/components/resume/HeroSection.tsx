import Image from 'next/image'
import Link from 'next/link'
import { GlassCard } from '@/components/glass/GlassCard'

interface HeroData {
  name: string
  title: string
  company: string
  bio: string
  avatar: string
  github: string
}

interface HeroSectionProps {
  data: HeroData
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <GlassCard variant="organic" className="hero-section">
      {/* Left: copy */}
      <div className="hero-copy">
        <span className="availability-pill">Currently at {data.company}</span>

        <div className="hero-heading">
          <h2>{data.name}</h2>
          <span className="hero-subtitle">
            <span className="hero-subtitle__orb" aria-hidden="true" />
            <span className="hero-subtitle__text">{data.title}</span>
          </span>
        </div>

        <p>{data.bio}</p>

        <div className="hero-actions">
          <Link href="/blog" className="soft-button primary">
            View My Blog
          </Link>
          <a
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="soft-button"
          >
            View Github
          </a>
        </div>
      </div>

      {/* Right: portrait */}
      <div className="hero-portrait">
        <div className="portrait-aura" />
        <div className="portrait-ring">
          <div className="portrait-shell">
            <div className="portrait-face">
              <Image
                className="portrait-image"
                src={data.avatar}
                alt={`${data.name} portrait`}
                width={300}
                height={300}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
