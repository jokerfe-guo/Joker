'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Overview',   href: '/admin',            icon: '◈' },
  { label: 'Posts',      href: '/admin/posts',       icon: '✦' },
  { label: 'Resume',     href: '/admin/resume',      icon: '⬡' },
  { label: 'Analytics',  href: '/admin/analytics',   icon: '◎' },
  { label: 'Settings',   href: '/admin/settings',    icon: '⚙' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="glass"
      style={{
        width: 220,
        minHeight: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 16px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <div style={{ marginBottom: 36, paddingLeft: 12 }}>
        <Link
          href="/"
          style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: '#00d4ff',
            fontWeight: 600,
            display: 'block',
            marginBottom: 4,
          }}
        >
          ← Joker.AI
        </Link>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fbff' }}>
          Admin
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f8fbff' : 'rgba(222,232,245,0.6)',
                background: isActive
                  ? 'rgba(0,212,255,0.1)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(0,212,255,0.2)'
                  : '1px solid transparent',
                transition: 'all 160ms ease',
                textDecoration: 'none',
              }}
            >
              <span style={{
                fontSize: '1rem',
                color: isActive ? '#00d4ff' : 'rgba(222,232,245,0.4)',
                width: 18,
                textAlign: 'center',
              }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 24,
          paddingLeft: 12,
          fontSize: '0.72rem',
          color: 'rgba(222,232,245,0.3)',
        }}
      >
        Protected by Cloudflare Access
      </div>
    </aside>
  )
}
