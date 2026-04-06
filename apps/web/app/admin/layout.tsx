import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Joker Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        gap: 0,
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: 'clamp(24px, 4vw, 48px)',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  )
}
