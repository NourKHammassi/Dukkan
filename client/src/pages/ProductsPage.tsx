import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { getProducts, getCategories } from '../api'
import type { Product, Category } from '../types'

const PAGE_SIZE = 12

export default function ProductsPage() {
  const addItem = useCartStore(state => state.addItem)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState<string | null>(null)

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({
      page,
      pageSize: PAGE_SIZE,
      categoryId: selectedCategory ?? undefined,
      search: search || undefined,
    })
      .then(result => {
        setProducts(result.items ?? [])
        setTotal(result.totalCount ?? 0)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [page, selectedCategory, search])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function handleCategory(id: string | null) {
    setSelectedCategory(id)
    setPage(1)
  }

  function handleAddToBag(product: Product) {
    addItem(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* HEADER */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)' }}>Shop</h1>
        {!loading && (
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
            {total} {total === 1 ? 'product' : 'products'}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}>

        {/* SIDEBAR */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '32px 24px', position: 'sticky', top: 62, alignSelf: 'start', maxHeight: 'calc(100vh - 62px)', overflowY: 'auto' }}>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
            <div style={{ position: 'relative' }}>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search products..."
                style={{
                  width: '100%',
                  height: 40,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  fontFamily: 'Inter',
                  fontSize: 13,
                  color: 'var(--text)',
                  padding: '0 36px 0 12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 14 }}
              >
                ↵
              </button>
            </div>
          </form>

          {/* Categories */}
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Categories
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[{ id: null, name: 'All' }, ...categories.map(c => ({ id: c.id, name: c.name }))].map(cat => (
              <button
                key={cat.id ?? 'all'}
                onClick={() => handleCategory(cat.id)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: selectedCategory === cat.id ? 'var(--text)' : 'none',
                  color: selectedCategory === cat.id ? 'white' : 'var(--text-2)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  fontSize: 13,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <div style={{ padding: '32px 40px' }}>

          {/* Active filters */}
          {(search || selectedCategory) && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {search && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', border: '1px solid var(--border)', fontFamily: 'Inter', fontSize: 12, color: 'var(--text-2)' }}>
                  "{search}"
                  <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              )}
              {selectedCategory && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', border: '1px solid var(--border)', fontFamily: 'Inter', fontSize: 12, color: 'var(--text-2)' }}>
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => handleCategory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              )}
            </div>
          )}

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {loading
              ? Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ height: 10, width: '40%', background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ height: 14, width: '70%', background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                    <div style={{ height: 12, width: '30%', background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />
                  </div>
                ))
              : products.map(product => (
                  <div key={product.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ aspectRatio: '4/3', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {product.images?.[0] ?? product.imageUrl
  ? <img src={product.images?.[0] ?? product.imageUrl!} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{product.categoryName}</span>
                        }
                      </div>
                    </Link>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {product.categoryName}
                    </div>
                    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{product.name}</div>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToBag(product)}
                        style={{
                          height: 32,
                          padding: '0 14px',
                          background: addedId === product.id ? '#276749' : 'var(--text)',
                          color: 'white',
                          border: 'none',
                          fontFamily: 'Space Grotesk',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                      >
                        {addedId === product.id ? '✓ Added' : '+ Bag'}
                      </button>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p className="font-display" style={{ fontSize: 28, fontWeight: 300, color: 'var(--text-2)' }}>No products found</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 48 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ height: 36, padding: '0 20px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? 'var(--text-3)' : 'var(--text)' }}
              >
                ← Prev
              </button>
              <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ height: 36, padding: '0 20px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? 'var(--text-3)' : 'var(--text)' }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}