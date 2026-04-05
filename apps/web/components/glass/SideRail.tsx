'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const dots = [
  { label: 'Resume', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
]

export function SideRail() {
  const pathname = usePathname()

  return (
    <aside className="side-rail">
      <div className="rail-logo">AI</div>
      <div className="rail-dots">
        {dots.map((dot) => (
          <Link key={dot.href} href={dot.href} aria-label={dot.label}>
            <button
              type="button"
              aria-label={dot.label}
              className={
                pathname === dot.href ||
                (dot.href !== '/' && pathname.startsWith(dot.href))
                  ? 'rail-dot active'
                  : 'rail-dot'
              }
            />
          </Link>
        ))}
      </div>
    </aside>
  )
}
