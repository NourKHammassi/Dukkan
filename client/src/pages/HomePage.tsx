import { useEffect, useState } from 'react'
import { getCategories, getFeaturedProducts, getStores } from '../api'
import type { Category, Product, Store } from '../types'

const categoryGradient: Record<string, string> = {
  default: 'linear-gradient(155deg, #F7F5F1 0%, #EDEBE6 100%)',
  tech: [
    'radial-gradient(circle 110px at 50% 46%, rgba(100,120,200,.12) 0%, transparent 100%)',
    'linear-gradient(155deg, #EDF0FA 0%, #DDE2F0 100%)',
  ].join(', '),
  fashion: [
    'radial-gradient(ellipse 70% 80% at 50% 44%, rgba(180,140,100,.10) 0%, transparent 100%)',
    'linear-gradient(155deg, #FAF5EE 0%, #F0E8DC 100%)',
  ].join(', '),
  beauty: [
    'radial-gradient(circle 100px at 50% 44%, rgba(220,170,130,.13) 0%, transparent 100%)',
    'linear-gradient(155deg, #FAF0E2 0%, #F0E2CC 100%)',
  ].join(', '),
  food: [
    'radial-gradient(circle 100px at 50% 44%, rgba(100,180,80,.12) 0%, transparent 100%)',
    'linear-gradient(155deg, #EBF4E5 0%, #D8ECCC 100%)',
  ].join(', '),
  home: [
    'radial-gradient(ellipse 70% 70% at 50% 46%, rgba(160,140,110,.11) 0%, transparent 100%)',
    'linear-gradient(155deg, #F5F0E8 0%, #EAE2D4 100%)',
  ].join(', '),
}

function getGradient(cat?: string) {
  if (!cat) return categoryGradient.default
  const key = cat.toLowerCase()
  return Object.entries(categoryGradient).find(([k]) => key.includes(k))?.[1] ?? categoryGradient.default
}

function Skeleton({ w = '100%', h = 20, style = {} }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) {
  return (
    <div style={{ width: w, height: h, background: 'linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', ...style }} />
  )
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([getCategories(), getFeaturedProducts(8), getStores(3)])
      .then(([cats, prods, strs]) => {
        setCategories(cats)
        setProducts(prods)
        setStores(strs)
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        .product-card:hover .add-btn { opacity: 1 !important; transform: translateX(-50%) translateY(0) !important; }
      `}</style>

      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 520, borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 24 }}>
            Multi-Vendor Marketplace
          </span>
          <h1 className="font-display" style={{ fontSize: 72, lineHeight: 1.0, fontWeight: 300, color: 'var(--text)', marginBottom: 24 }}>
            Discover<br /><em>Curated</em><br />Stores
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
            Browse independent sellers, unique products, and fresh collections — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '13px 28px', cursor: 'pointer' }}>
              Shop Now
            </button>
            <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '13px 28px', cursor: 'pointer' }}>
              Browse Stores
            </button>
          </div>
        </div>
        <div style={{ background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(180,160,130,.13) 0%, transparent 100%)' }} />
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div className="font-display" style={{ fontSize: 140, lineHeight: 1, color: 'var(--bg-3)', fontWeight: 300 }}>Dukkan</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 8 }}>
              دكان — Your marketplace
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 40px', borderBottom: '1px solid var(--border)', gap: 32 }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Categories</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            {loading ? '—' : `${categories.length} departments`}
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ flex: 1, padding: '28px 32px', borderRight: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <Skeleton w={20} h={12} style={{ marginBottom: 10 }} />
                  <Skeleton w="70%" h={16} />
                </div>
              ))
            : error || categories.length === 0
            ? <div style={{ padding: '32px 40px', fontFamily: 'Space Grotesk', fontSize: 12, color: 'var(--text-3)' }}>{error ? 'Could not load categories.' : 'No categories yet.'}</div>
            : categories.slice(0, 6).map((cat, i) => (
                <div key={cat.id} style={{ flex: 1, padding: '28px 32px', borderRight: i < categories.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', marginBottom: 8, letterSpacing: '0.08em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{cat.name}</div>
                  {cat.productCount != null && (
                    <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{cat.productCount} items</div>
                  )}
                </div>
              ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section style={{ padding: '64px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 40 }}>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 300, color: 'var(--text)' }}>New Arrivals</h2>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {loading ? '' : `${products.length} products`}
          </span>
          <div style={{ flex: 1 }} />
          <a href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none' }}>View All →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)' }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg)', padding: 24 }}>
                  <Skeleton w="100%" h={240} style={{ marginBottom: 16 }} />
                  <Skeleton w="60%" h={14} style={{ marginBottom: 8 }} />
                  <Skeleton w="40%" h={14} style={{ marginBottom: 6 }} />
                  <Skeleton w="25%" h={16} />
                </div>
              ))
            : error || products.length === 0
            ? (
                <div style={{ gridColumn: '1/-1', background: 'var(--bg)', padding: '48px 32px', fontFamily: 'Space Grotesk', fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
                  {error ? 'Could not load products. Is the backend running?' : 'No products yet.'}
                </div>
              )
            : products.map(product => (
                <div key={product.id} className="product-card" style={{ background: 'var(--bg)', cursor: 'pointer', position: 'relative' }}>
                  {product.isNew && (
                    <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', padding: '3px 7px', zIndex: 1 }}>New</div>
                  )}
                  <div style={{ height: 240, background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : getGradient(product.categoryName), position: 'relative', overflow: 'hidden' }}>
                    {!product.imageUrl && (
                      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                        {product.categoryName ?? 'Product'}
                      </div>
                    )}
                    <button className="add-btn" style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%) translateY(8px)', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s, transform 0.2s', whiteSpace: 'nowrap' }}>
                      + Add to Bag
                    </button>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {product.storeName ?? product.categoryName}
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>{product.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-3)', textDecoration: 'line-through' }}>${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section style={{ background: 'var(--text)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px 64px', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Open a Store</div>
          <h2 className="font-display" style={{ fontSize: 44, fontWeight: 300, lineHeight: 1.1, color: 'white' }}>Sell on <em>Dukkan</em></h2>
        </div>
        <div style={{ maxWidth: 320, textAlign: 'right' }}>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24 }}>
            Join our marketplace of independent sellers. Set up your store in minutes.
          </p>
          <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'white', color: '#0C0B09', border: 'none', padding: '13px 28px', cursor: 'pointer' }}>
            Start Selling
          </button>
        </div>
      </section>

      {/* STORES */}
      <section style={{ padding: '64px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 40 }}>
          <h2 className="font-display" style={{ fontSize: 36, fontWeight: 300, color: 'var(--text)' }}>Featured Stores</h2>
          <div style={{ flex: 1 }} />
          <a href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none' }}>All Stores →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg)', padding: '36px 32px' }}>
                  <Skeleton w={56} h={56} style={{ marginBottom: 20 }} />
                  <Skeleton w="55%" h={18} style={{ marginBottom: 10 }} />
                  <Skeleton w="80%" h={12} style={{ marginBottom: 6 }} />
                  <Skeleton w="60%" h={12} />
                </div>
              ))
            : error || stores.length === 0
            ? <div style={{ gridColumn: '1/-1', background: 'var(--bg)', padding: '48px 32px', fontFamily: 'Space Grotesk', fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>{error ? 'Could not load stores.' : 'No stores yet.'}</div>
            : stores.map(store => (
                <div key={store.id} style={{ background: 'var(--bg)', padding: '36px 32px', cursor: 'pointer' }}>
                  <div style={{ width: 56, height: 56, background: store.logoUrl ? `url(${store.logoUrl}) center/cover` : 'var(--bg-3)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!store.logoUrl && (
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: 'var(--text-2)' }}>{store.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{store.name}</div>
                  {store.description && (
                    <div style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {store.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 16 }}>
                    {store.productCount != null && <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)' }}>{store.productCount} products</span>}
                    {store.rating != null && <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)' }}>★ {store.rating.toFixed(1)}</span>}
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 40px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)' }}>Dukkan</span>
        <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-3)' }}>© 2024 Dukkan. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map(link => (
            <a key={link} href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', textDecoration: 'none', letterSpacing: '0.05em' }}>{link}</a>
          ))}
        </div>
      </footer>
    </main>
  )
}