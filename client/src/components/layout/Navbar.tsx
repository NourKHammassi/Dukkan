import { useCartStore } from '../../store/cartStore'

export default function Navbar() {
  const count = useCartStore(state => state.count())

  return (
    <nav style={{ height: 62, background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100, gap: 48 }}>
      <a href="/" style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', textDecoration: 'none' }}>Dukkan</a>
      <div style={{ display: 'flex', gap: 28, flex: 1 }}>
        {['Shop', 'Stores', 'Orders', 'About'].map(link => (
          <a key={link} href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-2)', textDecoration: 'none' }}>{link}</a>
        ))}
      </div>
      <a href="/cart" style={{ textDecoration: 'none' }}>
        <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--text)', color: 'white', border: 'none', padding: '9px 18px', cursor: 'pointer' }}>
          Bag ({count})
        </button>
      </a>
    </nav>
  )
}