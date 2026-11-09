import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getOrders } from '../api'
import type { Order } from '../types'

const statusColor: Record<string, string> = {
  Pending: '#b7791f',
  Confirmed: '#2b6cb0',
  Shipped: '#6b46c1',
  Delivered: '#276749',
  Cancelled: '#c0392b',
}

const statusBg: Record<string, string> = {
  Pending: '#fefcbf',
  Confirmed: '#ebf8ff',
  Shipped: '#faf5ff',
  Delivered: '#f0fff4',
  Cancelled: '#fff5f5',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    getOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)' }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>
          Your Orders
        </h1>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px' }}>

        {/* LOADING */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 140, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
            ))}
            <style>{`
              @keyframes shimmer {
                0%,100% { opacity: 1 }
                50% { opacity: 0.4 }
              }
            `}</style>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#c0392b' }}>{error}</p>
        )}

        {/* EMPTY */}
        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p className="font-display" style={{ fontSize: 32, fontWeight: 300, color: 'var(--text-2)', marginBottom: 24 }}>
              No orders yet
            </p>
            <Link
              to="/"
              style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none', borderBottom: '1px solid var(--text)' }}
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid var(--border)' }}>
            {orders.map((order, idx) => (
              <div
                key={order.id}
                style={{
                  padding: '28px 32px',
                  background: 'var(--bg)',
                  borderBottom: idx < orders.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* ORDER HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-3)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{
                      fontFamily: 'Space Grotesk',
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: statusColor[order.status] ?? 'var(--text-2)',
                      background: statusBg[order.status] ?? 'var(--bg-2)',
                      padding: '4px 10px',
                    }}>
                      {order.status}
                    </span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {order.items?.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'var(--bg-2)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text)' }}>{item.productName}</div>
                          <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)' }}>Qty {item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text-2)' }}>
                       ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* SHIPPING */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)' }}>
                    Ships to: {order.shippingAddress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}