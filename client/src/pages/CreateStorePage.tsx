import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStore, uploadImage } from '../api'

export default function CreateStorePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      let logo: string | undefined
      if (logoFile) {
        setUploading(true)
        logo = await uploadImage(logoFile)
        setUploading(false)
      }
      setSubmitting(true)
      await createStore({ name, description: description || undefined, logo })
      navigate('/seller/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to create store.')
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

  const busy = uploading || submitting

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* heading */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', margin: '0 0 12px' }}>
            Seller
          </p>
          <h1 className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', lineHeight: 1.1, margin: 0 }}>
            Create Your Store
          </h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Logo */}
          <span style={{ ...label, marginTop: 0 }}>
            Store Logo&nbsp;
            <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </span>
          <label style={{ display: 'inline-block', cursor: 'pointer' }}>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} style={{ display: 'none' }} />
            <div style={{ width: 96, height: 96, border: '1px solid var(--border)', background: 'var(--bg-2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)' }}>Upload</span>
              }
            </div>
          </label>

          {/* Name */}
          <label style={label}>Store Name</label>
          <input
            style={field}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Your store name"
          />

          {/* Description */}
          <label style={label}>
            Description&nbsp;
            <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            style={{ ...field, resize: 'vertical', minHeight: 100 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell customers about your store"
          />

          {error && (
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b', marginTop: 20, marginBottom: 0 }}>{error}</p>
          )}

          <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              type="submit"
              disabled={busy}
              style={{
                padding: '14px 36px',
                background: 'var(--text)',
                color: 'var(--bg)',
                border: 'none',
                fontFamily: 'Space Grotesk',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
              }}
            >
              {uploading ? 'Uploading…' : submitting ? 'Creating…' : 'Create Store'}
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