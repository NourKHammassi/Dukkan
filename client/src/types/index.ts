export interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

export interface Store {
  id: string
  name: string
  description?: string
  logoUrl?: string
  productCount?: number
  rating?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number | null
  imageUrl?: string
  images?: string[]
  categoryId: string
  categoryName?: string
  storeId: string
  storeName?: string
  stock?: number
  sku?: string | null
  avgRating?: number | null
  reviewCount?: number
  isActive?: boolean
  createdAt?: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}