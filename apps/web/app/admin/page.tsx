// Phase 3: full admin dashboard
// Admin is protected by Cloudflare Access in production
export default function AdminPage() {
  return (
    <div style={{ padding: '40px', color: '#f8fbff' }}>
      <p style={{ color: '#00d4ff', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Admin</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>Dashboard</h1>
      <p style={{ color: 'rgba(222,232,245,0.68)', marginTop: 12 }}>
        Full analytics dashboard coming in Phase 3.
      </p>
    </div>
  )
}
