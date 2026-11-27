import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadImage, getCategories, getProduct, updateProduct } from '../api'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([getProduct(id), getCategories()])
      .then(([product, cats]) => {
        setName(product.name)
        setDescription(product.description ?? '')
        setPrice(String(product.price))
        setCompareAtPrice(product.compareAtPrice ? String(product.compareAtPrice) : '')
        setStock(String(product.stock))
        setCategoryId(product.categoryId)
        setExistingImage(product.images?.[0] ?? null)
        setCategories(cats)
      })
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      let imageUrl = existingImage
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImage(imageFile)
        setUploading(false)
      }
      setSubmitting(true)
      await updateProduct(id!, {
        name,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        stock: parseInt(stock),
        categoryId,
        images: imageUrl ? [imageUrl] : [],
      })
      navigate('/seller/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.')
      setUploading(false)
      setSubmitting(false)
    }
  }

  const field: React.CSSProperties = {
    width: '100%',
    padding: '12px 0',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text)',
    fontSize: 15,
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const lbl: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-3)',
    marginBottom: 4,
    marginTop: 28,
  }

  if (loading) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)' }}>Loading…</span>
    </main>
  )

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '64px 24px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Seller
          </p>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, margin: 0 }}>
            Edit Product
          </h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* image */}
          <label style={{ ...lbl, marginTop: 0 }}>Product Image</label>
          <label style={{ display: 'block', border: '1px solid var(--border)', cursor: 'pointer', overflow: 'hidden', background: 'var(--bg-2)' }}>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
            {(imagePreview ?? existingImage) ? (
              <img src={imagePreview ?? existingImage!} alt="preview" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-3)' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)' }}>Click to upload</span>
              </div>
            )}
          </label>
          {existingImage && !imagePreview && (
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Click to upload a new image, or leave to keep the current one.</p>
          )}

          {/* category */}
          <label style={lbl}>Category</label>
          <select style={{ ...field, cursor: 'pointer' }} value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* name */}
          <label style={lbl}>Name</label>
          <input style={field} value={name} onChange={e => setName(e.target.value)} required placeholder="Product name" />

          {/* description */}
          <label style={lbl}>Description</label>
          <textarea style={{ ...field, resize: 'vertical', minHeight: 100 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the product" />

          {/* price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={lbl}>Price (TND)</label>
              <input style={field} type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" />
            </div>
            <div>
              <label style={lbl}>Compare-at Price</label>
              <input style={field} type="number" min="0" step="0.01" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          {/* stock */}
          <label style={lbl}>Stock</label>
          <input style={field} type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} required placeholder="0" />

          {error && (
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b', marginTop: 20 }}>{error}</p>
          )}

          <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              type="submit"
              disabled={uploading || submitting}
              style={{
                padding: '14px 36px',
                background: 'var(--text)',
                color: 'var(--bg)',
                border: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: uploading || submitting ? 'not-allowed' : 'pointer',
                opacity: uploading || submitting ? 0.5 : 1,
              }}
            >
              {uploading ? 'Uploading…' : submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              style={{ background: 'none', border: 'none', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}