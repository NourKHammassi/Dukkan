import api from './client'
import type { Category, Store, Product, PagedResult } from '../types'

export const getCategories = () =>
  api.get('/api/categories').then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getFeaturedProducts = (pageSize = 8) =>
  api
    .get<PagedResult<Product>>('/api/products', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getStores = (pageSize = 3) =>
  api
    .get('/api/stores', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getProduct = (id: string) =>
  api.get<Product>(`/api/products/${id}`).then(r => r.data)