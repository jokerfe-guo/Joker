import type { Metadata } from 'next'
import './globals.css'
import { OrbBackground } from '@/components/glass/OrbBackground'
import { SideRail } from '@/components/glass/SideRail'

export const metadata: Metadata = {
  title: {
    default: 'Joker.AI — Senior Front-end Engineer',
    template: '%s | Joker.AI',
  },
  description:
    'Crafting high-performance digital experiences with immersive aesthetics, fluid interactions, and front-end systems that survive real product scale.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    siteName: 'Joker.AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="app-shell">
          <OrbBackground />
          <SideRail />
          <div className="page-shell">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
