import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const itemCount = useCartStore(state => state.items.reduce((s, i) => s + i.quantity, 0))
  const { user, logout, isAuthenticated } = useAuthStore()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      height: 62,
    }}>

      {/* LOGO */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="font-display" style={{ fontSize: 22, fontWeight: 400, letterSpacing: '0.04em', color: 'var(--text)' }}>
          Dukkan
        </span>
      </Link>

      {/* CENTER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link
          to="/products"
          style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none' }}
        >
          Shop
        </Link>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {isAuthenticated() ? (
          <>
            <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>
              {user?.firstName}
            </span>
            {user?.role === 'Admin' && (
              <Link
                to="/orders"
                style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none' }}
              >
                Orders
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none' }}
          >
            Sign In
          </Link>
        )}

        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
            Bag{itemCount > 0 ? `(${itemCount})` : ''}
          </span>
        </Link>
      </div>
    </nav>
  )
}