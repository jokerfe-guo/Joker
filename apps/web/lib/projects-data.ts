/**
 * Default projects data — seeded from original Joker portfolio.
 * In Phase 3 this will be replaced by D1 database reads.
 */

export interface Project {
  id: string
  title: string
  role: string
  stack: string
  impact: string
  period: string
  description: string
  tags: string[]
  previewLabel?: string
  featured?: boolean
}

export const projectsData: Project[] = [
  {
    id: 'design-system',
    title: 'Glass Design System',
    role: 'Lead Front-end Architect',
    stack: 'React 19 / TypeScript / CSS Custom Properties',
    impact: '+42% dev velocity',
    period: '2024',
    description:
      'Built a company-wide glassmorphism component library consumed by six product teams. Defined token architecture, animation primitives, and a living Storybook documentation site. Reduced per-feature styling effort by half and established a coherent visual language across the entire product suite.',
    tags: ['Design System', 'React', 'TypeScript'],
    previewLabel: 'Component Library',
    featured: true,
  },
  {
    id: 'perf-platform',
    title: 'Performance Monitoring Platform',
    role: 'Front-end Lead',
    stack: 'Next.js 15 / Web Vitals / D3.js',
    impact: '−38% LCP across suite',
    period: '2023',
    description:
      'Designed and shipped a real-time performance monitoring dashboard that surfaces Core Web Vitals, custom traces, and budget alerts. Integrated with Cloudflare Analytics for edge-level data, and drove a 38 percent reduction in LCP across the product suite by surfacing actionable insights directly in the developer workflow.',
    tags: ['Performance', 'Next.js', 'Analytics'],
    previewLabel: 'Dashboard',
    featured: true,
  },
  {
    id: 'interactive-stories',
    title: 'Interactive Editorial Stories',
    role: 'Motion Engineer',
    stack: 'React / Motion / WebGL / GSAP',
    impact: '+28% engagement',
    period: '2023',
    description:
      'Engineered a scroll-driven narrative format for editorial campaigns. Used GSAP ScrollTrigger for scene composition, WebGL for particle effects, and a custom React renderer that maps scroll progress to animation timelines. Shipped four campaigns that averaged 28 percent higher user engagement than static article formats.',
    tags: ['Motion', 'WebGL', 'GSAP'],
    previewLabel: 'Editorial Campaign',
  },
  {
    id: 'obsidian-blog',
    title: 'Joker.AI Tech Blog',
    role: 'Full-stack Engineer',
    stack: 'Next.js 15 / Cloudflare D1 / Hono / MDX',
    impact: '100% edge rendering',
    period: '2024 - Present',
    description:
      'This very site — a glassmorphism portfolio and technical blog built on a Turborepo monorepo. Blog content flows from Obsidian markdown to GitHub, compiled with MDX at build time, and served from Cloudflare Pages edge nodes worldwide. Includes Pagefind full-text search, Giscus comments, a D1-backed admin dashboard, and a reading analytics layer.',
    tags: ['Next.js', 'Cloudflare', 'Hono'],
    previewLabel: 'This Site',
    featured: true,
  },
  {
    id: 'a11y-audit',
    title: 'Accessibility Audit Toolkit',
    role: 'UI Engineer',
    stack: 'TypeScript / axe-core / Playwright',
    impact: 'WCAG AA certified',
    period: '2022',
    description:
      'Wrote a CI-integrated accessibility audit pipeline using axe-core and Playwright that runs on every PR, annotates violations inline, and blocks merges on critical failures. Brought the main product to WCAG 2.1 AA certification and dramatically reduced accessibility regressions going forward.',
    tags: ['Accessibility', 'Testing', 'TypeScript'],
    previewLabel: 'CI Pipeline',
  },
  {
    id: 'design-tokens',
    title: 'Cross-Platform Token System',
    role: 'Design Technologist',
    stack: 'Style Dictionary / CSS / Swift / Kotlin',
    impact: '3 platforms, 1 source',
    period: '2022',
    description:
      'Built a single-source design token pipeline using Style Dictionary that transforms JSON token definitions into CSS custom properties, Swift enums, and Android XML. Eliminated design drift between iOS, Android, and web teams, and allowed designers to ship token updates without requiring engineering involvement.',
    tags: ['Design System', 'Tooling', 'Mobile'],
    previewLabel: 'Token Pipeline',
  },
]
