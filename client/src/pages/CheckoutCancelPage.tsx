import { useNavigate } from 'react-router-dom'

export default function CheckoutCancelPage() {
  const navigate = useNavigate()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 40px' }}>
        <div className="font-display" style={{ fontSize: 120, lineHeight: 1, fontWeight: 300, color: 'var(--bg-3)' }}>✕</div>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 32, marginTop: -4 }}>
          Payment Cancelled
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 48 }}>
          Your order hasn't been placed. Your bag is still waiting for you.
        </p>
        <button
          onClick={() => navigate('/cart')}
          style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer' }}
        >
          Return to Bag
        </button>
      </div>
    </main>
  )
}