import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }))
        } else {
          set(state => ({ items: [...state.items, { product, quantity }] }))
        }
      },

      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.product.id !== productId) })),

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'dukkan-cart' }
  )
)