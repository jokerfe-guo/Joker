'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { label: 'Resume', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
]

export function GlassNav() {
  const pathname = usePathname()

  return (
    <nav className="floating-nav glass">
      <span className="brand-mark">Joker.AI</span>

      <div className="screen-switcher" aria-label="Navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href))
                ? 'switch-pill active'
                : 'switch-pill'
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle />
        <Link href="/blog" className="cta-button">
          Contact
        </Link>
      </div>
    </nav>
  )
}
