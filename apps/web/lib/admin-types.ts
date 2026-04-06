// Shared types for admin pages and their client components

export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
}

export interface SocialLinks {
  github: string
  [key: string]: string
}

export interface AdminSettings {
  site_title: string
  site_description: string
  social_links: SocialLinks
  giscus_config: GiscusConfig
}

export interface TopPost {
  slug: string
  viewCount: number
  likeCount: number
}

export interface DailyStat {
  date: string
  views: number
}

export interface OverviewData {
  total: number
  topPosts: TopPost[]
}
