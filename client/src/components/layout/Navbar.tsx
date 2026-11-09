import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const count = useCartStore(state => state.count())
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav style={{ height: 62, background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100, gap: 48 }}>
      <a href="/" style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none' }}>Dukkan</a>

      <div style={{ display: 'flex', gap: 28, flex: 1 }}>
        {['Shop', 'Stores', 'Orders', 'About'].map(link => (
          <a key={link} href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-2)', textDecoration: 'none' }}>{link}</a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isAuthenticated() ? (
          <>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'var(--text-2)' }}>
              {user?.firstName}
            </span>
            <button
              onClick={handleLogout}
              style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', color: 'var(--text-3)', border: '1px solid var(--border)', padding: '7px 14px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <a href="/login" style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none' }}>
            Sign In
          </a>
        )}

        <a href="/cart" style={{ textDecoration: 'none' }}>
          <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '9px 18px', cursor: 'pointer' }}>
            Bag ({count})
          </button>
        </a>
      </div>
    </nav>
  )
}