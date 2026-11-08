const stats = [
  { n: '124', l: 'Active Stores' },
  { n: '3.8k', l: 'Products' },
  { n: '98%', l: 'Satisfaction' },
]

const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Food & Organic', 'Home', 'Sports']

const products = [
  { id: 1, store: 'TechHaven', name: 'Wireless Earbuds Pro X', price: '89 TND', was: '129 TND', badge: 'Best Seller', img: 'tech' },
  { id: 2, store: 'The Loom Studio', name: 'Linen Co-ord Set — Sage', price: '74 TND', was: null, badge: 'New', img: 'fashion' },
  { id: 3, store: 'Nour Naturals', name: 'Argan Oil Face Serum', price: '38 TND', was: null, badge: 'Organic', img: 'beauty' },
  { id: 4, store: 'Green Grove', name: 'Organic Harissa Paste', price: '12 TND', was: null, badge: 'Local', img: 'food' },
  { id: 5, store: 'TechHaven', name: 'USB-C Hub 7-in-1 Slim', price: '45 TND', was: '59 TND', badge: null, img: 'tech' },
  { id: 6, store: 'The Loom Studio', name: 'Merino Wool Throw', price: '96 TND', was: '120 TND', badge: 'New', img: 'home' },
  { id: 7, store: 'Green Grove', name: 'Jasmine Green Tea — 50g', price: '18 TND', was: null, badge: 'Organic', img: 'food' },
  { id: 8, store: 'TechHaven', name: 'Laptop Stand — Aluminum', price: '62 TND', was: '79 TND', badge: null, img: 'tech' },
]

const stores = [
  { n: '01', name: 'TechHaven', tag: 'Electronics & Gadgets', products: 24, rating: '4.8', reviews: '312' },
  { n: '02', name: 'The Loom Studio', tag: 'Handmade Textiles & Fashion', products: 38, rating: '4.9', reviews: '189' },
  { n: '03', name: 'Green Grove', tag: 'Organic Food & Spices', products: 61, rating: '4.7', reviews: '445' },
]

const imgBg: Record<string, string> = {
  tech: 'radial-gradient(circle 110px at 50% 46%, rgba(100,120,200,.12) 0%, transparent 100%), radial-gradient(ellipse 55% 45% at 50% 42%, rgba(60,80,180,.07) 0%, transparent 65%), linear-gradient(155deg, #EDF0FA 0%, #E4E8F6 50%, #DDE2F2 100%)',
  fashion: 'radial-gradient(ellipse 70% 80% at 50% 60%, rgba(215,195,170,.25) 0%, transparent 70%), linear-gradient(155deg, #FAF5EE 0%, #F0E8DC 50%, #E8DECF 100%)',
  beauty: 'radial-gradient(circle 100px at 55% 42%, rgba(230,165,80,.18) 0%, transparent 100%), radial-gradient(ellipse 55% 48% at 55% 40%, rgba(210,145,55,.1) 0%, transparent 65%), linear-gradient(155deg, #FAF0E2 0%, #F2E4CE 50%, #EAD8BB 100%)',
  food: 'radial-gradient(circle 100px at 50% 44%, rgba(80,160,80,.15) 0%, transparent 100%), radial-gradient(ellipse 55% 48% at 46% 42%, rgba(55,140,55,.08) 0%, transparent 65%), linear-gradient(155deg, #EBF4E5 0%, #DFF0D2 50%, #D3E8C0 100%)',
  home: 'radial-gradient(ellipse 70% 75% at 50% 58%, rgba(205,190,170,.25) 0%, transparent 70%), linear-gradient(155deg, #F5F0E8 0%, #EDE5D8 50%, #E5DAC8 100%)',
}

const u = { textTransform: 'uppercase' as const }

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg)' }}>

      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '55% 45%', minHeight: 'calc(92vh - 62px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ padding: '72px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', ...u, color: 'var(--text-2)', marginBottom: 32 }}>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--text-3)' }} />
            Multi-Vendor Marketplace
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(3.2rem, 5.5vw, 5.8rem)', fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.025em', marginBottom: 28 }}>
            Discover <em>local</em><br />stores,<br />
            <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>delivered.</strong>
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 400, marginBottom: 44 }}>
            Independent Tunisian stores — electronics, fashion, organic food, and more. All in one place.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', ...u, background: 'var(--text)', color: 'white', border: 'none', padding: '15px 30px', cursor: 'pointer' }}>Start Shopping</button>
            <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', ...u, background: 'none', color: 'var(--text)', border: '1px solid var(--border)', padding: '15px 30px', cursor: 'pointer' }}>Browse Stores</button>
          </div>
          <div style={{ display: 'flex', gap: 48, marginTop: 60, paddingTop: 44, borderTop: '1px solid var(--border)' }}>
            {stats.map(s => (
              <div key={s.l}>
                <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.6rem', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 7 }}>{s.n}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', ...u, color: 'var(--text-3)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 55%, rgba(220,210,195,.6) 0%, transparent 65%), radial-gradient(circle 200px at 50% 45%, rgba(240,232,220,.5) 0%, transparent 60%), linear-gradient(170deg, #F2EDE5 0%, #EAE3D8 40%, #E2D9C8 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 24, left: 24, fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', ...u, color: 'var(--text-2)', background: 'rgba(255,255,255,.85)', padding: '6px 12px' }}>Featured</div>
          <div style={{ position: 'absolute', top: 24, right: 24, fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', ...u, background: 'var(--text)', color: 'white', padding: '6px 12px' }}>Best Seller</div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 28px', background: 'linear-gradient(to top, rgba(255,255,255,.95) 50%, transparent 100%)' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', ...u, color: 'var(--text-3)', marginBottom: 7 }}>TechHaven</div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.1, marginBottom: 10 }}>Wireless Earbuds Pro X</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'flex', gap: 10, alignItems: 'center' }}>
              89 TND <span style={{ fontWeight: 400, color: 'var(--text-3)', textDecoration: 'line-through', fontSize: 12 }}>129 TND</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div style={{ borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {categories.map((cat, i) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 28px', borderRight: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', fontWeight: 300, color: 'var(--text-3)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', ...u }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <section style={{ padding: '72px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', ...u, color: 'var(--text-3)', marginBottom: 8 }}>Curated for you</div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.4rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 }}>New Arrivals</div>
          </div>
          <a href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', ...u, color: 'var(--text-2)', textDecoration: 'none' }}>View All →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'var(--bg)', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
              onMouseEnter={e => { (e.currentTarget.querySelector('.add-btn') as HTMLElement).style.transform = 'translateY(0)' }}
              onMouseLeave={e => { (e.currentTarget.querySelector('.add-btn') as HTMLElement).style.transform = 'translateY(100%)' }}
            >
              <div style={{ aspectRatio: '3/4', background: imgBg[p.img], position: 'relative', overflow: 'hidden' }}>
                <div className="add-btn" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--text)', color: 'white', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', ...u, padding: 13, textAlign: 'center', transform: 'translateY(100%)', transition: 'transform .25s ease' }}>
                  Add to Bag
                </div>
              </div>
              <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)' }}>
                {p.badge && <div style={{ display: 'inline-block', fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', ...u, background: 'var(--bg-2)', color: 'var(--text-2)', padding: '3px 8px', marginBottom: 8, border: '1px solid var(--border)' }}>{p.badge}</div>}
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 500, letterSpacing: '0.16em', ...u, color: 'var(--text-3)', marginBottom: 5 }}>{p.store}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3, marginBottom: 10 }}>{p.name}</div>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>
                  {p.price}
                  {p.was && <span style={{ fontWeight: 400, color: 'var(--text-3)', textDecoration: 'line-through', fontSize: '1rem', marginLeft: 7 }}>{p.was}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <div style={{ background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 60px', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', ...u, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>This Week's Collection</div>
          <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1, color: 'white' }}>
            Tunisian-made products, <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>crafted with care.</strong>
          </div>
        </div>
        <button style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', ...u, background: 'white', color: 'var(--text)', border: 'none', padding: '15px 30px', cursor: 'pointer', flexShrink: 0 }}>Explore Collection</button>
      </div>

      {/* STORES */}
      <section style={{ padding: '72px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', ...u, color: 'var(--text-3)', marginBottom: 8 }}>Handpicked vendors</div>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2.4rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 }}>Our Stores</div>
          </div>
          <a href="#" style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', ...u, color: 'var(--text-2)', textDecoration: 'none' }}>All Stores →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {stores.map(s => (
            <div key={s.n} style={{ background: 'var(--bg)', padding: '36px 32px', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '3.5rem', fontWeight: 300, color: 'var(--text-3)', lineHeight: 1, marginBottom: 24 }}>{s.n}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 7 }}>{s.name}</div>
              <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.4 }}>{s.tag} · {s.products} products</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.3rem', fontWeight: 600 }}>{s.rating}</span>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 400, color: 'var(--text-3)', letterSpacing: '0.05em' }}>★ {s.reviews} reviews</span>
                <a href="#" style={{ marginLeft: 'auto', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', ...u, color: 'var(--text-2)', textDecoration: 'none' }}>Visit →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', ...u, color: 'var(--text-3)' }}>Dukkan</span>
        <span style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-3)' }}>© 2026 Dukkan Marketplace · Tunisia</span>
      </div>

    </main>
  )
}