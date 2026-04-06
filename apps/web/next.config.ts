import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow reading from content/ directory (Obsidian vault submodule)
  // Moved from experimental.outputFileTracingIncludes (Next.js 15.3+)
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

export default nextConfig
