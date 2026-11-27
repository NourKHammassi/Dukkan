import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyStore, getProducts, deleteProduct, getStoreOrders, updateOrderStatus } from '../api'
import type { Product, Order } from '../types'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  isApproved: boolean
  createdAt: string
}

type Tab = 'products' | 'orders'

const STATUS_NEXT: Record<string, string | null> = {
  Pending: 'Shipped',
  Paid: 'Shipped',
  Shipped: 'Delivered',
  Delivered: null,
  Cancelled: null,
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: '#b7791f',
    Paid: '#276749',
    Shipped: '#1a4a8a',
    Delivered: '#276749',
    Cancelled: '#c0392b',
  }
  const c = colors[status] ?? 'var(--text-3)'
  return (
    <span style={{
      fontFamily: 'Space Grotesk',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: c,
      border: `1px solid ${c}`,
      padding: '3px 10px',
      flexShrink: 0,
    }}>
      {status}
    </span>
  )
}

export default function SellerDashboardPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [hasStore, setHasStore] = useState(true)
  const [storeLoading, setStoreLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [tab, setTab] = useState<Tab>('products')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersLoaded, setOrdersLoaded] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

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

  const handleTabChange = (t: Tab) => {
    setTab(t)
    if (t === 'orders' && !ordersLoaded) {
      setOrdersLoading(true)
      getStoreOrders()
        .then((data: Order[]) => setOrders(data ?? []))
        .catch(() => {})
        .finally(() => { setOrdersLoading(false); setOrdersLoaded(true) })
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      setDeletingId(null)
    } catch {
      /* silent */
    } finally {
      setDeleting(false)
    }
  }

  const handleAdvanceStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const updated = await updateOrderStatus(orderId, nextStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o))
    } catch {
      /* silent */
    } finally {
      setUpdatingOrderId(null)
    }
  }

  if (storeLoading) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)' }}>Loading…</span>
    </main>
  )

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

        {store?.isApproved && store.description && (
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 48, maxWidth: 600 }}>
            {store.description}
          </p>
        )}

        {store?.isApproved && (
          <>
            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
              {(['products', 'orders'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === t ? '2px solid var(--text)' : '2px solid transparent',
                    marginBottom: -1,
                    paddingBottom: 14,
                    paddingRight: 32,
                    fontFamily: 'Space Grotesk',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: tab === t ? 'var(--text)' : 'var(--text-3)',
                    cursor: 'pointer',
                  }}
                >
                  {t === 'products'
                    ? `Products${!productsLoading ? ` (${products.length})` : ''}`
                    : 'Orders'}
                </button>
              ))}
            </div>

            {/* ── Products tab ── */}
            {tab === 'products' && (
              productsLoading ? (
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

                      {/* actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <Link
                          to={`/products/${p.id}`}
                          style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', textDecoration: 'none' }}
                        >
                          View →
                        </Link>
                        <Link
                          to={`/seller/products/${p.id}/edit`}
                          style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none' }}
                        >
                          Edit
                        </Link>
                        {deletingId === p.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-2)' }}>Delete?</span>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deleting}
                              style={{ background: 'none', border: 'none', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c0392b', cursor: 'pointer', padding: 0 }}
                            >
                              {deleting ? '…' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              disabled={deleting}
                              style={{ background: 'none', border: 'none', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', cursor: 'pointer', padding: 0 }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(p.id)}
                            style={{ background: 'none', border: 'none', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c0392b', cursor: 'pointer', padding: 0 }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── Orders tab ── */}
            {tab === 'orders' && (
              ordersLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: 80, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                  ))}
                  <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', border: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', margin: 0 }}>No orders yet.</p>
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border)' }}>
                  {orders.map((o, i) => {
                    const next = STATUS_NEXT[o.status] ?? null
                    return (
                      <div
                        key={o.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px', borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : 'none' }}
                      >
                        {/* order info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{o.orderNumber}</div>
                          <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-3)' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {o.items?.length ? ` · ${o.items.length} item${o.items.length > 1 ? 's' : ''}` : ''}
                          </div>
                        </div>

                        {/* total */}
                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, color: 'var(--text)', flexShrink: 0 }}>
                          ${o.totalAmount.toFixed(2)}
                        </div>

                        {/* status */}
                        <StatusBadge status={o.status} />

                        {/* advance status */}
                        {next && (
                          <button
                            onClick={() => handleAdvanceStatus(o.id, next)}
                            disabled={updatingOrderId === o.id}
                            style={{
                              background: 'none',
                              border: '1px solid var(--border)',
                              padding: '6px 14px',
                              fontFamily: 'Space Grotesk',
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--text)',
                              cursor: updatingOrderId === o.id ? 'not-allowed' : 'pointer',
                              opacity: updatingOrderId === o.id ? 0.5 : 1,
                              flexShrink: 0,
                            }}
                          >
                            {updatingOrderId === o.id ? '…' : `Mark ${next}`}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </>
        )}
      </div>
    </main>
  )
}