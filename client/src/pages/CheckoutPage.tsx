import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { addToBackendCart, clearBackendCart, createOrder } from '../api'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const [fullName, setFullName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0) navigate('/')
    else if (!isAuthenticated()) navigate('/login')
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const shippingAddress = [
        fullName,
        addressLine1,
        addressLine2,
        city,
        postalCode,
        country,
        phone,
      ].filter(Boolean).join(', ')

      await clearBackendCart()
      for (const item of items) {
        await addToBackendCart(item.product.id, item.quantity)
      }

      await createOrder(shippingAddress)

      clearCart()
      navigate('/order-confirmed')
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    height: 48,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    fontFamily: 'Inter',
    fontSize: 14,
    color: 'var(--text)',
    padding: '0 16px',
    outline: 'none',
    width: '100%',
  }

  const labelStyle = {
    fontFamily: 'Space Grotesk',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em' as const,
    textTransform: 'uppercase' as const,
    color: 'var(--text-3)',
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)' }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>Checkout</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 'calc(100vh - 145px)' }}>

        {/* FORM */}
        <div style={{ padding: '48px 56px', borderRight: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>

            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
              Shipping Address
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Address</label>
              <input style={inputStyle} value={addressLine1} onChange={e => setAddressLine1(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Apartment, suite, etc. (optional)</label>
              <input style={inputStyle} value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Postal Code</label>
                <input style={inputStyle} value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Country</label>
                <input style={inputStyle} value={country} onChange={e => setCountry(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
              Payment
            </div>
            <div style={{ border: '1px solid var(--border)', padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 24, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2 }} />
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>Cash on Delivery</span>
              <div style={{ marginLeft: 'auto', width: 16, height: 16, borderRadius: '50%', background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
              </div>
            </div>

            {error && (
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b', margin: 0 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ height: 52, background: loading ? 'var(--text-3)' : 'var(--text)', color: 'white', border: 'none', fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}
            >
              {loading ? 'Placing Order...' : `Place Order — $${total().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div style={{ padding: '48px 36px', position: 'sticky', top: 62, alignSelf: 'start' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 28 }}>
            Order Summary
          </div>

          {items.map(item => (
            <div key={item.product.id} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, flexShrink: 0, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 8, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {item.product.categoryName}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{item.product.name}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)' }}>Qty {item.quantity}</div>
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Total</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
              ${total().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}