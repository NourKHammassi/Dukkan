import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useCartStore } from '../store/cartStore'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { items } = useCartStore()

  const handleSubmit = async () => {
    if (!address.trim()) {
      setError('Shipping address is required')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/orders/checkout', {
        shippingAddress: address,
items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      })
      window.location.href = data.checkoutUrl
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)' }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>Checkout</h1>
      </div>

      <div style={{ maxWidth: 560, margin: '64px auto', padding: '0 40px' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 20 }}>
          Shipping Address
        </div>

        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Street address, city, state, ZIP, country"
          rows={4}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontFamily: 'Inter',
            fontSize: 14,
            color: 'var(--text)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b', marginTop: 8 }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: 24 }} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            height: 52,
            background: loading ? 'var(--bg-3)' : 'var(--text)',
            color: 'white',
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 12,
          }}
        >
          {loading ? 'Redirecting to payment…' : 'Pay with Stripe →'}
        </button>

        <button
          onClick={() => navigate('/cart')}
          style={{
            width: '100%',
            height: 44,
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'Space Grotesk',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Back to Bag
        </button>
      </div>
    </main>
  )
}