import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

// Content directory is the git-submodule Obsidian vault
// Resolved from the monorepo root: joker-blog/content/posts/
const CONTENT_DIR = path.join(process.cwd(), '../../content/posts')

export interface PostFrontmatter {
  title: string
  date: string          // ISO date string
  tags: string[]
  description: string
  published: boolean
  cover: string
}

export interface Post extends PostFrontmatter {
  slug: string
  readingTime: string   // "5 min read"
  content: string       // raw Markdown
}

export interface PostMeta extends PostFrontmatter {
  slug: string
  readingTime: string
}

// ─────────────────────────────────────────
// Read a single post by slug
// ─────────────────────────────────────────
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const fm = normaliseFrontmatter(data)

  if (!fm.published) return null

  return {
    ...fm,
    slug,
    readingTime: readingTime(content).text,
    content,
  }
}

// ─────────────────────────────────────────
// Get all published post metadata (no content body)
// Sorted newest → oldest
// ─────────────────────────────────────────
export async function getAllPosts(tag?: string): Promise<PostMeta[]> {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))

  const posts: PostMeta[] = files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      const fm = normaliseFrontmatter(data)

      if (!fm.published) return null

      return {
        ...fm,
        slug,
        readingTime: readingTime(content).text,
      }
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (tag) return posts.filter((p) => p.tags.includes(tag))
  return posts
}

// ─────────────────────────────────────────
// Get all unique tags across published posts
// ─────────────────────────────────────────
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set(posts.flatMap((p) => p.tags))
  return Array.from(tagSet).sort()
}

// ─────────────────────────────────────────
// Get all slugs for static generation
// ─────────────────────────────────────────
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts()
  return posts.map((p) => p.slug)
}

// ─────────────────────────────────────────
// Group posts by year → month
// Used for the blog timeline sidebar
// ─────────────────────────────────────────
export function groupPostsByMonth(posts: PostMeta[]) {
  const groups: Record<string, Record<string, PostMeta[]>> = {}

  for (const post of posts) {
    const date = new Date(post.date)
    const year = String(date.getFullYear())
    const month = date.toLocaleString('en-US', { month: 'long' })

    if (!groups[year]) groups[year] = {}
    if (!groups[year][month]) groups[year][month] = []
    groups[year][month].push(post)
  }

  return groups
}

// ─────────────────────────────────────────
// Normalise raw frontmatter from gray-matter
// ─────────────────────────────────────────
function normaliseFrontmatter(data: Record<string, unknown>): PostFrontmatter {
  return {
    title:       String(data.title ?? 'Untitled'),
    date:        data.date instanceof Date
                   ? data.date.toISOString()
                   : String(data.date ?? new Date().toISOString()),
    tags:        Array.isArray(data.tags) ? data.tags.map(String) : [],
    description: String(data.description ?? ''),
    published:   Boolean(data.published ?? true),
    cover:       String(data.cover ?? ''),
  }
}
