import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register(firstName, lastName, email, password)
      setAuth(data.token, data.user)
      navigate('/')
    } catch {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <h1 className="font-display" style={{ fontSize: 48, fontWeight: 300, color: 'var(--text)', marginBottom: 8, textAlign: 'center' }}>
          Create Account
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)', textAlign: 'center', marginBottom: 40 }}>
          Join Dukkan
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                style={{ height: 48, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', padding: '0 16px', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                style={{ height: 48, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', padding: '0 16px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ height: 48, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', padding: '0 16px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ height: 48, border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', padding: '0 16px', outline: 'none' }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ height: 52, background: loading ? 'var(--text-3)' : 'var(--text)', color: 'white', border: 'none', fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-3)', textAlign: 'center', marginTop: 28 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}