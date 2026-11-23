import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="font-display" style={{ fontSize: 160, lineHeight: 1, fontWeight: 300, color: 'var(--bg-3)', marginBottom: 0 }}>404</div>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 32, marginTop: -8 }}>
          Page Not Found
        </p>
        <button
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer' }}
        >
          Back to Home
        </button>
      </div>
    </main>
  )
}