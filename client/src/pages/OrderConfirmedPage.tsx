import { useNavigate } from 'react-router-dom'

export default function OrderConfirmedPage() {
  const navigate = useNavigate()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ fontFamily: 'Space Grotesk', fontSize: 32, color: 'var(--text-3)' }}>✓</div>
      <h1 className="font-display" style={{ fontSize: 52, fontWeight: 300, color: 'var(--text)' }}>Order Confirmed</h1>
      <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)' }}>
        Thank you for your order. We'll be in touch soon.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer', marginTop: 8 }}
      >
        Continue Shopping
      </button>
    </main>
  )
}