import { useState, useEffect } from 'react'
import {
  getAdminStats, getAdminUsers, getPendingStores,
  banUser, unbanUser, approveStore, rejectStore,
} from '../api'

type Tab = 'overview' | 'stores' | 'users'

interface AdminStats {
  totalUsers?: number
  totalProducts?: number
  totalStores?: number
  totalOrders?: number
  totalRevenue?: number
  pendingStores?: number
}

interface PendingStore {
  id: string
  name: string
  ownerName?: string
  ownerEmail?: string
  createdAt: string
}

interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean   // ← was isBanned
  createdAt: string
}

const SHIMMER = `@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}`

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [stores, setStores] = useState<PendingStore[]>([])
  const [storesLoading, setStoresLoading] = useState(false)
  const [storesLoaded, setStoresLoaded] = useState(false)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersLoaded, setUsersLoaded] = useState(false)

  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'stores' && !storesLoaded) {
      setStoresLoading(true)
      getPendingStores()
        .then(setStores)
        .catch(() => {})
        .finally(() => { setStoresLoading(false); setStoresLoaded(true) })
    }
    if (tab === 'users' && !usersLoaded) {
      setUsersLoading(true)
      getAdminUsers()
        .then(setUsers)
        .catch(() => {})
        .finally(() => { setUsersLoading(false); setUsersLoaded(true) })
    }
  }, [tab])

  const handleApprove = async (id: string) => {
    setActionId(id + '-approve')
    try {
      await approveStore(id)
      setStores(p => p.filter(s => s.id !== id))
      setStats(p => p ? { ...p, pendingStores: Math.max(0, (p.pendingStores ?? 1) - 1) } : p)
    } catch {}
    setActionId(null)
  }

  const handleReject = async (id: string) => {
    setActionId(id + '-reject')
    try {
      await rejectStore(id)
      setStores(p => p.filter(s => s.id !== id))
      setStats(p => p ? { ...p, pendingStores: Math.max(0, (p.pendingStores ?? 1) - 1) } : p)
    } catch {}
    setActionId(null)
  }

  const handleBan = async (id: string) => {
    setActionId(id + '-ban')
    try {
      await banUser(id)
      setUsers(p => p.map(u => u.id === id ? { ...u, isActive: false } : u))  // ← was isBanned: true
    } catch {}
    setActionId(null)
  }

  const handleUnban = async (id: string) => {
    setActionId(id + '-unban')
    try {
      await unbanUser(id)
      setUsers(p => p.map(u => u.id === id ? { ...u, isActive: true } : u))  // ← was isBanned: false
    } catch {}
    setActionId(null)
  }

  const tabBtn = (t: Tab): React.CSSProperties => ({
    fontFamily: 'Space Grotesk',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: tab === t ? 'var(--text)' : 'var(--text-3)',
    background: 'none',
    border: 'none',
    borderBottom: tab === t ? '2px solid var(--text)' : '2px solid transparent',
    padding: '16px 0',
    marginRight: 32,
    cursor: 'pointer',
  })

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{SHIMMER}</style>

      {/* Header */}
      <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', margin: '0 0 8px' }}>
          Platform
        </p>
        <h1 className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', margin: 0 }}>
          Admin Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 40px', borderBottom: '1px solid var(--border)', display: 'flex' }}>
        <button style={tabBtn('overview')} onClick={() => setTab('overview')}>Overview</button>
        <button style={tabBtn('stores')} onClick={() => setTab('stores')}>
          Pending Stores{(stats?.pendingStores ?? 0) > 0 ? ` (${stats!.pendingStores})` : ''}
        </button>
        <button style={tabBtn('users')} onClick={() => setTab('users')}>Users</button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          statsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ height: 120, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: '1px solid var(--border)' }}>
              {[
                { label: 'Users',    value: stats?.totalUsers    ?? 0 },
                { label: 'Products', value: stats?.totalProducts ?? 0 },
                { label: 'Stores',   value: stats?.totalStores   ?? 0 },
                { label: 'Orders',   value: stats?.totalOrders   ?? 0 },
                { label: 'Revenue',  value: stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toFixed(0)}` : '—' },
              ].map((tile, i) => (
                <div key={i} style={{ padding: '32px 28px', borderRight: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', marginBottom: 10, lineHeight: 1 }}>
                    {tile.value}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                    {tile.label}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* PENDING STORES */}
        {tab === 'stores' && (
          storesLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1,2,3].map(i => <div key={i} style={{ height: 72, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />)}
            </div>
          ) : stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', margin: 0 }}>No stores pending approval.</p>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)' }}>
              {stores.map((store, i) => (
                <div key={store.id} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px', borderBottom: i < stores.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{store.name}</div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      {store.ownerEmail ?? store.ownerName ?? '—'}
                      {' · '}
                      {new Date(store.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(store.id)}
                    disabled={actionId === store.id + '-approve'}
                    style={{ padding: '8px 20px', background: 'var(--text)', color: 'var(--bg)', border: 'none', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: actionId === store.id + '-approve' ? 0.4 : 1 }}
                  >
                    {actionId === store.id + '-approve' ? '…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(store.id)}
                    disabled={actionId === store.id + '-reject'}
                    style={{ padding: '8px 20px', background: 'none', color: '#c0392b', border: '1px solid #c0392b', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: actionId === store.id + '-reject' ? 0.4 : 1 }}
                  >
                    {actionId === store.id + '-reject' ? '…' : 'Reject'}
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* USERS */}
        {tab === 'users' && (
          usersLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 72, background: 'var(--bg-2)', animation: 'shimmer 1.4s infinite' }} />)}
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text-3)', margin: 0 }}>No users found.</p>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)' }}>
              {users.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '20px 28px', borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', opacity: !u.isActive ? 0.5 : 1 }}>  {/* ← was u.isBanned */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
                      {u.firstName} {u.lastName}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                      {u.email}
                    </div>
                  </div>

                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: u.role === 'Admin' ? 'var(--text)' : u.role === 'Seller' ? '#2b6cb0' : 'var(--text-3)', flexShrink: 0 }}>
                    {u.role}
                  </span>

                  {!u.isActive && (  // ← was u.isBanned
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c0392b', background: '#fff5f5', padding: '3px 8px', flexShrink: 0 }}>
                      Banned
                    </span>
                  )}

                  {u.role !== 'Admin' && (
                    !u.isActive ? (  // ← was u.isBanned
                      <button
                        onClick={() => handleUnban(u.id)}
                        disabled={actionId === u.id + '-unban'}
                        style={{ padding: '8px 20px', background: 'none', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: actionId === u.id + '-unban' ? 0.4 : 1, flexShrink: 0 }}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBan(u.id)}
                        disabled={actionId === u.id + '-ban'}
                        style={{ padding: '8px 20px', background: 'none', color: '#c0392b', border: '1px solid #c0392b', fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', opacity: actionId === u.id + '-ban' ? 0.4 : 1, flexShrink: 0 }}
                      >
                        Ban
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  )
}