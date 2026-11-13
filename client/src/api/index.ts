import api from './client'
import type { Product, PagedResult, AuthResponse, Order, Review } from '../types'

export const getCategories = () =>
  api.get('/api/categories').then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getProducts = (params?: {
  page?: number
  pageSize?: number
  categoryId?: string
  search?: string
}) =>
  api.get<PagedResult<Product>>('/api/products', { params })
    .then(r => Array.isArray(r.data) ? { items: r.data, totalCount: r.data.length } : r.data)

export const getFeaturedProducts = (pageSize = 8) =>
  api.get<PagedResult<Product>>('/api/products', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getStores = (pageSize = 3) =>
  api.get('/api/stores', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getProduct = (id: string) =>
  api.get<Product>(`/api/products/${id}`).then(r => r.data)

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/api/auth/login', { email, password }).then(r => r.data)

export const register = (firstName: string, lastName: string, email: string, password: string) =>
  api.post<AuthResponse>('/api/auth/register', { firstName, lastName, email, password }).then(r => r.data)

export const addToBackendCart = (productId: string, quantity: number) =>
  api.post('/api/cart', { productId, quantity })

export const clearBackendCart = () =>
  api.delete('/api/cart')

export const createOrder = (shippingAddress: string) =>
  api.post('/api/orders', { shippingAddress }).then(r => r.data)

export const getOrders = () =>
  api.get<Order[]>('/api/orders/my').then(r => r.data)

export const getReviews = (productId: string) =>
  api.get<Review[]>(`/api/reviews/product/${productId}`).then(r => r.data)

export const createReview = (productId: string, orderId: string | null, rating: number, comment: string) =>
  api.post<Review>('/api/reviews', { productId, orderId, rating, comment }).then(r => r.data)

export const deleteReview = (reviewId: string) =>
  api.delete(`/api/reviews/${reviewId}`)