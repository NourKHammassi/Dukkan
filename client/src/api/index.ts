import api from './client'

export const getFeaturedProducts = (pageSize = 8) =>
  api
    .get('/api/products', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getStores = (pageSize = 3) =>
  api
    .get('/api/stores', { params: { page: 1, pageSize } })
    .then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])

export const getCategories = () =>
  api.get('/api/categories').then(r => Array.isArray(r.data) ? r.data : r.data.items ?? [])