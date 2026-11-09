import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types'

interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('dukkan_token', token)
        set({ token, user })
      },
      logout: () => {
        localStorage.removeItem('dukkan_token')
        set({ token: null, user: null })
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'dukkan-auth' }
  )
)