import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyStore, getProducts } from '../api'
import type { Product } from '../types'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  isApproved: boolean
  createdAt: string
}

export default function SellerDashboardPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [hasStore, setHasStore] = useState(true)
  const [storeLoading, setStoreLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)

  useEffect(() => {
    getMyStore()
      .then((s: Store) => {
        setStore(s)
        if (s.isApproved) {
          setProductsLoading(true)
          getProducts({ page: 1, pageSize: 100, storeId: s.id })
            .then(r => setProducts(r.items ?? []))
            .catch(() => {})
            .finally(() => setProductsLoading(false))
        }
      })
      .catch((err: any) => {
        if (err.response?.status === 404) setHasStore(false)
      })
      .finally(() => setStoreLoading(false))
  }, [])

  if (storeLoading) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)' }}>Loading…</span>
    </main>
  )

  /* ── No store yet ── */
  if (!hasStore) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, textAlign: 'center', padding: '0 24px' }}>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', margin: '0 0 16px' }}>
          Seller
        </p>
        <h1 className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', margin: '0 0 20px' }}>
          Open your store
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 36px' }}>
          Create your store on Dukkan and start selling to customers.
        </p>
        <Link
          to="/seller/store/create"
          style={{ display: 'inline-block', padding: '14px 36px', background: 'var(--text)', color: 'var(--bg)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          Create Store
        </Link>
      </div>
    </main>
  )

  /* ── Has store ── */
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {store?.logo && (
            <div style={{ width: 48, height: 48, border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={store.logo} alt="store logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', margin: '0 0 6px' }}>
              Seller Dashboard
            </p>
            <h1 className="font-display" style={{ fontSize: 40, fontWeight: 400, color: 'var(--text)', margin: 0 }}>
              {store?.name}
            </h1>
          </div>
        </div>
        {store?.isApproved && (
          <Link
            to="/seller/products/new"
            style={{ padding: '12px 28px', background: 'var(--text)', color: 'var(--bg)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0 }}
          >
            + New Product
          </Link>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

        {/* Pending approval banner */}
        {!store?.isApproved && (
          <div style={{ padding: '24px 32px', border: '1px solid var(--border)', marginBottom: 48, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b7791f', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 8 }}>
                Pending Approval
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                Your store is under review. You'll be able to list products once an admin approves it.
              </p>
            </div>
          </div>
        )}

        {/* Store description (if any) */}
        {store?.isApproved && store.description && (
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
            {store.description}
          </p>
        )}

        {/* Products section */}
        {store?.isApproved && (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 className="font-display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--text)', margin: 0 }}>
                Products
              </h2>
              {!productsLoading && (
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
              )}
            </div>

            {productsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: 80, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                ))}
                <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', margin: '0 0 24px' }}>No products yet.</p>
                <Link
                  to="/seller/products/new"
                  style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none', borderBottom: '1px solid var(--text)', paddingBottom: 2 }}
                >
                  Add your first product
                </Link>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border)' }}>
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px', borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    {/* image */}
                    <div style={{ width: 56, height: 56, flexShrink: 0, background: 'var(--bg-2)', overflow: 'hidden' }}>
                      {(p.images?.[0] ?? p.imageUrl) && (
                        <img src={p.images?.[0] ?? p.imageUrl!} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>

                    {/* name + category */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.categoryName}</div>
                    </div>

                    {/* price */}
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, color: 'var(--text)', width: 100, textAlign: 'right', flexShrink: 0 }}>
                      ${p.price.toFixed(2)}
                    </div>

                    {/* stock */}
                    <div style={{ width: 80, textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.stock > 0 ? 'var(--text-3)' : '#c0392b' }}>
                        {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                      </span>
                    </div>

                    {/* view link */}
                    <Link
                      to={`/products/${p.id}`}
                      style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', textDecoration: 'none', flexShrink: 0 }}
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}