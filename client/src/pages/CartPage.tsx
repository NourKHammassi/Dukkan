import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, updateQty, clearCart, total, count } = useCartStore()

  if (items.length === 0) {
    return (
      <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>Your bag is empty</h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)' }}>Add some products to get started.</p>
        <button
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </main>
    )
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>Your Bag</h1>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {count()} {count() === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 'calc(100vh - 145px)' }}>

        {/* ITEMS */}
        <div style={{ borderRight: '1px solid var(--border)' }}>
          {items.map((item, i) => (
            <div
              key={item.product.id}
              style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '32px 40px', alignItems: 'flex-start' }}
            >
              {/* image */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                  background: item.product.images?.[0]
                    ? `url(${item.product.images[0]}) center/cover`
                    : 'var(--bg-2)',
                  marginRight: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!item.product.images?.[0] && (
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                    {item.product.categoryName}
                  </span>
                )}
              </div>

              {/* info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {item.product.storeName}
                </div>
                <div
                  onClick={() => navigate(`/products/${item.product.id}`)}
                  style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text)', marginBottom: 12, cursor: 'pointer', lineHeight: 1.3 }}
                >
                  {item.product.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: 16, color: 'var(--text)' }}
                    >−</button>
                    <span style={{ width: 32, textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: 16, color: 'var(--text)' }}
                    >+</button>
                  </div>
                </div>
              </div>

              {/* price + remove */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.product.id)}
                  style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* clear cart */}
          <div style={{ padding: '20px 40px' }}>
            <button
              onClick={clearCart}
              style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear bag
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div style={{ padding: '40px 36px', position: 'sticky', top: 62, alignSelf: 'start' }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 28 }}>
            Order Summary
          </div>

          {items.map(item => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)', flex: 1, marginRight: 16 }}>
                {item.product.name} × {item.quantity}
              </span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.04em' }}>Total</span>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
              ${total().toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', height: 52, background: 'var(--text)', color: 'white', border: 'none', fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 12 }}
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => navigate('/')}
            style={{ width: '100%', height: 44, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  )
}