import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility
  experimental: {
    // Allow reading from content/ directory (Obsidian vault submodule)
    outputFileTracingIncludes: {
      '/**': ['./content/**/*'],
    },
  },
  images: {
    // Allow images from GitHub raw content
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  // Markdown / MDX
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

export default nextConfig

// ─── Post-build: run Pagefind to index the static output ──────────────────────
// Add this script to your package.json:
//   "postbuild": "pagefind --site .next/server/app --output-path public/pagefind"
// Or when using Cloudflare Pages, set the build command to:
//   pnpm build && pagefind --site .next/server/app --output-path public/pagefind
