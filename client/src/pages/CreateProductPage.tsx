import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadImage, getCategories } from '../api'
import api from '../api/client'

export default function CreateProductPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!imageFile) { setError('Please select an image.'); return }
    try {
      setUploading(true)
      const imageUrl = await uploadImage(imageFile)
      setUploading(false)
      setSubmitting(true)
      await api.post('/api/products', {
        name,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock),
        categoryId,
        images: [imageUrl]
      })
      navigate('/products')
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

  const label: React.CSSProperties = {
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

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '64px 24px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Seller
          </p>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, margin: 0 }}>
            New Product
          </h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* image upload */}
          <label style={{ ...label, marginTop: 0 }}>Product Image</label>
          <label style={{
            display: 'block',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            overflow: 'hidden',
            aspectRatio: imagePreview ? 'auto' : '16/9',
            background: 'var(--bg-2)',
          }}>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
            {imagePreview
              ? <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, gap: 8 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-3)' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)' }}>Click to upload</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)' }}>JPEG · PNG · WebP · max 5MB</span>
                </div>
              )
            }
          </label>

          {/* category */}
          <label style={label}>Category</label>
          <select style={{ ...field, cursor: 'pointer' }} value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* name */}
          <label style={label}>Name</label>
          <input style={field} value={name} onChange={e => setName(e.target.value)} required placeholder="Product name" />

          {/* description */}
          <label style={label}>Description</label>
          <textarea style={{ ...field, resize: 'vertical', minHeight: 100 }} value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe the product" />

          {/* price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={label}>Price (TND)</label>
              <input style={field} type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" />
            </div>
            <div>
              <label style={label}>Compare-at Price</label>
              <input style={field} type="number" min="0" step="0.01" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          {/* stock */}
          <label style={label}>Stock</label>
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
              {uploading ? 'Uploading…' : submitting ? 'Creating…' : 'Publish Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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