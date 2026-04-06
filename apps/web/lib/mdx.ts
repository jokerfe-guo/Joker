import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { ReactNode } from 'react'

type HastText = { type: 'text'; value: string }
type HastElement = {
  type: string
  tagName: string
  properties?: Record<string, unknown>
  children: HastElementContent[]
  value?: string
}
type HastElementContent = HastElement | HastText
type HastRoot = { type: string; children: HastElementContent[] }

type MdastText = { type: 'text'; value: string }
type MdastLink = { type: 'link'; url: string; children: MdastText[] }
type MdastParent = { children: Array<MdastText | MdastLink> }
type MdastRoot = { type: string; children: Array<MdastText | MdastLink> }

// ─────────────────────────────────────────
// Compiled MDX result
// ─────────────────────────────────────────
export interface CompiledPost {
  content: ReactNode
  headings: Heading[]
}

export interface Heading {
  id: string
  text: string
  level: 1 | 2 | 3 | 4
}

// ─────────────────────────────────────────
// Compile raw Markdown → React Server Component
// ─────────────────────────────────────────
export async function compileMdx(source: string): Promise<CompiledPost> {
  const headings: Heading[] = []

  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          // Obsidian wikilink resolver: [[other-post]] → /blog/other-post
          wikiliksPlugin,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: { className: ['heading-anchor'] },
            },
          ],
          // Heading extractor for TOC
          () => (tree: HastRoot) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { visit } = require('unist-util-visit') as any
            visit(tree, 'element', (node: HastElement) => {
              const match = node.tagName.match(/^h([1-4])$/)
              if (!match) return
              const level = parseInt(match[1]) as 1 | 2 | 3 | 4
              const id = String(node.properties?.id ?? '')
              const text = extractText(node)
              if (id && text) headings.push({ id, text, level })
            })
          },
        ],
      },
    },
  })

  return { content, headings }
}

// ─────────────────────────────────────────
// Obsidian wikilink remark plugin
// Converts [[other-post]] → [other-post](/blog/other-post)
// ─────────────────────────────────────────
function wikiliksPlugin() {
  return (tree: MdastRoot) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { visit } = require('unist-util-visit') as any
    visit(tree, 'text', (node: MdastText, index: number, parent: MdastParent) => {
      const wikilinkRegex = /\[\[([^\]]+)\]\]/g
      const parts: Array<MdastText | MdastLink> = []
      let last = 0
      let match

      while ((match = wikilinkRegex.exec(node.value)) !== null) {
        if (match.index > last) {
          parts.push({ type: 'text', value: node.value.slice(last, match.index) })
        }
        const slug = match[1].toLowerCase().replace(/\s+/g, '-')
        parts.push({
          type: 'link',
          url: `/blog/${slug}`,
          children: [{ type: 'text', value: match[1] }],
        })
        last = match.index + match[0].length
      }

      if (parts.length === 0) return
      if (last < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(last) })
      }

      parent.children.splice(index, 1, ...parts)
    })
  }
}

// ─────────────────────────────────────────
// Extract plain text from a hast node
// ─────────────────────────────────────────
function extractText(node: HastElement | HastElementContent): string {
  if (node.type === 'text') return (node as HastText).value
  if ('children' in node) {
    return (node.children as HastElementContent[]).map(extractText).join('')
  }
  return ''
}
