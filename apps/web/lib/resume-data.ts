/**
 * Default resume data — seeded from original Joker portfolio.
 * In Phase 3 this will be replaced by D1 database reads.
 * Shape must match the resume_sections JSON schema.
 */

export const heroData = {
  name: 'Joker',
  title: 'Senior Front-end Engineer',
  company: 'Kuaishou',
  bio: 'Crafting high-performance digital experiences with immersive aesthetics, fluid interactions, and front-end systems that survive real product scale.',
  avatar: '/avatar.jpg',
  github: 'https://github.com/jokerfe-guo',
}

export const metricsData = [
  { value: '5+', label: 'Years Exp' },
  { value: '40+', label: 'Projects' },
  { value: '12', label: 'Awards' },
  { value: '100%', label: 'Success' },
]

export const skillsData: string[][] = [
  ['React 19', 'TypeScript', 'Next.js'],
  ['Motion', 'Three.js', 'Design Systems'],
  ['Accessibility', 'Testing', 'Performance'],
]

export const experienceData = [
  {
    role: 'Senior Front-end Engineer',
    company: 'Nova Labs',
    time: '2023 - Present',
    body: 'Owning a product surface that blends interactive storytelling, design systems, and measurable performance budgets.',
  },
  {
    role: 'UI Platform Developer',
    company: 'Glassline Studio',
    time: '2020 - 2023',
    body: 'Built reusable front-end primitives for editorial, commerce, and portfolio experiences with a glassmorphism-first brand language.',
  },
]
