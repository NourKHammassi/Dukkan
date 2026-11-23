import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 40px' }}>
        <div className="font-display" style={{ fontSize: 120, lineHeight: 1, fontWeight: 300, color: 'var(--bg-3)' }}>✓</div>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 32, marginTop: -4 }}>
          Order Confirmed
        </p>
        <h1 className="font-display" style={{ fontSize: 40, fontWeight: 300, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>
          Payment successful.
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 48 }}>
          Your order has been placed. We'll send you an update when it ships.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/orders')}
            style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer' }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '13px 28px', cursor: 'pointer' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  )
}