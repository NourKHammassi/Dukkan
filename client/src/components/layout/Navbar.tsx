import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const itemCount = useCartStore(state => state.items.reduce((s, i) => s + i.quantity, 0))
  const { user, logout, isAuthenticated } = useAuthStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  const menuLink: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter',
    fontSize: 13,
    color: 'var(--text)',
    textDecoration: 'none',
    padding: '10px 20px',
    whiteSpace: 'nowrap',
    background: 'none',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>

        <Link to="/cart" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text)' }}>
            Bag{itemCount > 0 ? ` (${itemCount})` : ''}
          </span>
        </Link>

        {isAuthenticated() ? (
          <div ref={ref} style={{ position: 'relative' }}>
            {/* Avatar trigger */}
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: open ? 'var(--bg-2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Space Grotesk',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {user?.firstName?.[0]?.toUpperCase()}
            </button>

            {/* Dropdown */}
            {open && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                minWidth: 180,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}>
                {/* User info header */}
                <div style={{ padding: '12px 20px 10px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                    {user?.role}
                  </div>
                </div>

                {/* Role links */}
                {(user?.role === 'Admin' || user?.role === 'Seller') && (
                  <Link to="/seller/dashboard" style={menuLink} onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link to="/admin/dashboard" style={menuLink} onClick={() => setOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                {(user?.role === 'Admin' || user?.role === 'Seller') && (
                  <Link to="/seller/products/new" style={menuLink} onClick={() => setOpen(false)}>
                    Add Product
                  </Link>
                )}
                {user?.role === 'Admin' && (
                  <Link to="/orders" style={menuLink} onClick={() => setOpen(false)}>
                    Orders
                  </Link>
                )}
                {user?.role === 'Customer' && (
                  <Link to="/orders" style={menuLink} onClick={() => setOpen(false)}>
                    My Orders
                  </Link>
                )}

                {/* Sign out */}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }}>
                  <button
                    onClick={handleLogout}
                    style={{ ...menuLink, width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', color: 'var(--text-3)', paddingTop: 10, paddingBottom: 10 } as React.CSSProperties}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)', textDecoration: 'none' }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}