import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, getReviews, createReview, deleteReview } from '../api'
import type { Product, Review } from '../types'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const categoryGradient: Record<string, string> = {
  default: 'linear-gradient(155deg, #F7F5F1 0%, #EDEBE6 100%)',
  tech: ['radial-gradient(circle 110px at 50% 46%, rgba(100,120,200,.12) 0%, transparent 100%)', 'linear-gradient(155deg, #EDF0FA 0%, #DDE2F0 100%)'].join(', '),
  electronics: ['radial-gradient(circle 110px at 50% 46%, rgba(100,120,200,.12) 0%, transparent 100%)', 'linear-gradient(155deg, #EDF0FA 0%, #DDE2F0 100%)'].join(', '),
  fashion: ['radial-gradient(ellipse 70% 80% at 50% 44%, rgba(180,140,100,.10) 0%, transparent 100%)', 'linear-gradient(155deg, #FAF5EE 0%, #F0E8DC 100%)'].join(', '),
  clothing: ['radial-gradient(ellipse 70% 80% at 50% 44%, rgba(180,140,100,.10) 0%, transparent 100%)', 'linear-gradient(155deg, #FAF5EE 0%, #F0E8DC 100%)'].join(', '),
  beauty: ['radial-gradient(circle 100px at 50% 44%, rgba(220,170,130,.13) 0%, transparent 100%)', 'linear-gradient(155deg, #FAF0E2 0%, #F0E2CC 100%)'].join(', '),
  food: ['radial-gradient(circle 100px at 50% 44%, rgba(100,180,80,.12) 0%, transparent 100%)', 'linear-gradient(155deg, #EBF4E5 0%, #D8ECCC 100%)'].join(', '),
  home: ['radial-gradient(ellipse 70% 70% at 50% 46%, rgba(160,140,110,.11) 0%, transparent 100%)', 'linear-gradient(155deg, #F5F0E8 0%, #EAE2D4 100%)'].join(', '),
}

function getGradient(cat?: string) {
  if (!cat) return categoryGradient.default
  const key = cat.toLowerCase()
  return Object.entries(categoryGradient).find(([k]) => key.includes(k))?.[1] ?? categoryGradient.default
}

function Skeleton({ w = '100%', h = 20, style = {} }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) {
  return (
    <div style={{ width: w, height: h, background: 'linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', ...style }} />
  )
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#b7791f' : 'var(--bg-2)' }}>★</span>
      ))}
    </span>
  )
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore(state => state.addItem)
  const { user, isAuthenticated } = useAuthStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProduct(id)
      .then(p => { setProduct(p); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (!id) return
    setReviewsLoading(true)
    getReviews(id)
      .then(r => { setReviews(r); setReviewsLoading(false) })
      .catch(() => setReviewsLoading(false))
  }, [id])

  const imageBg = product?.images?.[0]
    ? `url(${product.images[0]}) center/cover`
    : getGradient(product?.categoryName)

  function handleAddToBag() {
    if (!product) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!id || rating === 0) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const review = await createReview(id, null, rating, comment)
      setReviews(prev => [review, ...prev])
      setRating(0)
      setComment('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      setSubmitError('Could not submit review. You may need to purchase this product first.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteReview(reviewId: string) {
    setDeletingId(reviewId)
    try {
      await deleteReview(reviewId)
      setReviews(prev => prev.filter(r => r.id !== reviewId))
    } catch {
      // silently fail
    } finally {
      setDeletingId(null)
    }
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  const canDelete = (review: Review) =>
    user?.role === 'Admin' || (review.authorId && review.authorId === user?.id)

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>

      {/* BREADCRUMB */}
      <div style={{ padding: '16px 40px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>Home</button>
        <span style={{ color: 'var(--text-3)', fontSize: 11 }}>/</span>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.05em' }}>{loading ? '...' : product?.categoryName}</span>
        <span style={{ color: 'var(--text-3)', fontSize: 11 }}>/</span>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text)', letterSpacing: '0.05em' }}>{loading ? '...' : product?.name}</span>
      </div>

      {error ? (
        <div style={{ padding: '80px 40px', textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text-3)' }}>
          Product not found.{' '}
          <button onClick={() => navigate('/')} style={{ color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Space Grotesk', fontSize: 13 }}>Back to home</button>
        </div>
      ) : (
        <>
          {/* SPLIT LAYOUT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 115px)' }}>

            {/* IMAGE */}
            <div style={{ borderRight: '1px solid var(--border)', position: 'sticky', top: 62, height: 'calc(100vh - 62px)' }}>
              {loading
                ? <Skeleton w="100%" h="100%" />
                : (
                  <div style={{ width: '100%', height: '100%', background: imageBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!product?.images?.[0] && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>{product?.categoryName}</div>
                        <div className="font-display" style={{ fontSize: 48, color: 'var(--bg-3)', fontWeight: 300 }}>{product?.name}</div>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* DETAILS */}
            <div style={{ padding: '56px 56px 80px' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <Skeleton w="40%" h={12} />
                  <Skeleton w="80%" h={36} />
                  <Skeleton w="30%" h={28} />
                  <Skeleton w="100%" h={1} style={{ marginTop: 8 }} />
                  <Skeleton w="100%" h={14} />
                  <Skeleton w="90%" h={14} />
                  <Skeleton w="70%" h={14} />
                </div>
              ) : product ? (
                <>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{product.storeName}</span>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{product.categoryName}</span>
                  </div>

                  <h1 className="font-display" style={{ fontSize: 52, fontWeight: 300, lineHeight: 1.1, color: 'var(--text)', marginBottom: 24 }}>{product.name}</h1>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 600, color: 'var(--text)' }}>${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span style={{ fontFamily: 'Inter', fontSize: 16, color: 'var(--text-3)', textDecoration: 'line-through' }}>${product.compareAtPrice.toFixed(2)}</span>
                    )}
                    {product.compareAtPrice && (
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'white', background: 'var(--text)', padding: '3px 8px' }}>SALE</span>
                    )}
                  </div>

                  {avgRating !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                      <Stars rating={Math.round(avgRating)} />
                      <span style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--text-3)' }}>({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                  )}

                  <div style={{ height: 1, background: 'var(--border)', margin: '28px 0' }} />

                  {product.description && (
                    <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>
                  )}

                  <div style={{ marginBottom: 32 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: (product.stock ?? 0) > 0 ? 'var(--text-2)' : '#c0392b' }}>
                      {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {(product.stock ?? 0) > 0 && (
                    <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 52, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: 18, color: 'var(--text)' }}>−</button>
                        <span style={{ width: 40, textAlign: 'center', fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{qty}</span>
                        <button onClick={() => setQty(q => Math.min(product.stock ?? 99, q + 1))} style={{ width: 44, height: 52, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk', fontSize: 18, color: 'var(--text)' }}>+</button>
                      </div>
                      <button onClick={handleAddToBag} style={{ flex: 1, height: 52, background: added ? '#2d6a4f' : 'var(--text)', color: 'white', border: 'none', fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}>
                        {added ? '✓ Added to Bag' : `Add to Bag — $${(product.price * qty).toFixed(2)}`}
                      </button>
                    </div>
                  )}

                  {added && (
                    <button onClick={() => navigate('/cart')} style={{ width: '100%', height: 44, background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 16 }}>
                      View Bag
                    </button>
                  )}

                  <div style={{ height: 1, background: 'var(--border)', margin: '32px 0' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {product.sku && (
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', width: 80 }}>SKU</span>
                        <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>{product.sku}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', width: 80 }}>Store</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>{product.storeName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', width: 80 }}>Category</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'var(--text-2)' }}>{product.categoryName}</span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '64px 80px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>

              {/* LEFT — review list */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 40 }}>
                  <h2 className="font-display" style={{ fontSize: 36, fontWeight: 300, color: 'var(--text)' }}>Reviews</h2>
                  {reviews.length > 0 && (
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em' }}>{reviews.length}</span>
                  )}
                </div>

                {reviewsLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {[1, 2].map(i => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Skeleton w="30%" h={12} />
                        <Skeleton w="20%" h={10} />
                        <Skeleton w="90%" h={13} />
                        <Skeleton w="70%" h={13} />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>No reviews yet. Be the first.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {reviews.map(review => (
                      <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{review.authorName}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--text-3)' }}>
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            {canDelete(review) && (
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                disabled={deletingId === review.id}
                                style={{ background: 'none', border: 'none', cursor: deletingId === review.id ? 'not-allowed' : 'pointer', fontFamily: 'Inter', fontSize: 11, color: deletingId === review.id ? 'var(--text-3)' : '#c0392b', padding: 0 }}
                              >
                                {deletingId === review.id ? '…' : 'Delete'}
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <Stars rating={review.rating} size={13} />
                        </div>
                        <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — write a review */}
              <div>
                <h2 className="font-display" style={{ fontSize: 36, fontWeight: 300, color: 'var(--text)', marginBottom: 40 }}>Write a Review</h2>

                {!isAuthenticated() ? (
                  <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)' }}>
                    <button onClick={() => navigate('/login')} style={{ color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter', fontSize: 14 }}>Sign in</button>
                    {' '}to leave a review.
                  </p>
                ) : submitted ? (
                  <p style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#276749', letterSpacing: '0.05em' }}>✓ Review submitted</p>
                ) : (
                  <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>Rating</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i)}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: i <= (hoverRating || rating) ? '#b7791f' : 'var(--bg-2)', transition: 'color 0.1s', padding: '0 2px' }}
                          >★</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>Comment</div>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience..."
                        style={{ width: '100%', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', padding: '12px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                      />
                    </div>

                    {submitError && (
                      <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b' }}>{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={rating === 0 || submitting}
                      style={{ height: 48, background: rating === 0 ? 'var(--bg-2)' : 'var(--text)', color: rating === 0 ? 'var(--text-3)' : 'white', border: 'none', fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: rating === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}