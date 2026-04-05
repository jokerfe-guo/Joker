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
