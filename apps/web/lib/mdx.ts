import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { createHighlighter, type BundledLanguage, type BundledTheme } from 'shiki'
import type { ReactNode } from 'react'

// ─────────────────────────────────────────
// Singleton Shiki highlighter
// Initialised once, reused across requests
// ─────────────────────────────────────────
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-dimmed', 'github-light'],
      langs: [
        'typescript', 'tsx', 'javascript', 'jsx',
        'css', 'html', 'json', 'bash', 'shell',
        'markdown', 'mdx', 'sql', 'yaml', 'toml',
      ] as BundledLanguage[],
    })
  }
  return highlighterPromise
}

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
  const highlighter = await getHighlighter()
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
          // Shiki code highlighter (rehype plugin inline)
          () => (tree: import('hast').Root) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { visit } = require('unist-util-visit') as any
            visit(tree, 'element', (node: import('hast').Element) => {
              if (node.tagName !== 'pre') return
              const code = node.children[0]
              if (!code || code.type !== 'element' || code.tagName !== 'code') return

              const className = (code.properties?.className as string[]) ?? []
              const langClass = className.find((c) => c.startsWith('language-'))
              const lang = (langClass?.replace('language-', '') ?? 'text') as BundledLanguage

              const rawCode = extractText(code)
              const html = highlighter.codeToHtml(rawCode, {
                lang,
                theme: 'github-dark-dimmed' as BundledTheme,
              })

              node.type = 'raw' as 'element'
              ;(node as unknown as { value: string }).value = html
              node.children = []
            })
          },
          // Heading extractor for TOC
          () => (tree: import('hast').Root) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { visit } = require('unist-util-visit') as any
            visit(tree, 'element', (node: import('hast').Element) => {
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
  return (tree: import('mdast').Root) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { visit } = require('unist-util-visit') as any
    visit(tree, 'text', (node: import('mdast').Text, index: number, parent: import('mdast').Parent) => {
      const wikilinkRegex = /\[\[([^\]]+)\]\]/g
      const parts = []
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
function extractText(node: import('hast').Element | import('hast').ElementContent): string {
  if (node.type === 'text') return (node as import('hast').Text).value
  if ('children' in node) {
    return (node.children as import('hast').ElementContent[]).map(extractText).join('')
  }
  return ''
}
