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
  price: number
  originalPrice?: number
  imageUrl?: string
  categoryId: string
  categoryName?: string
  storeId: string
  storeName?: string
  stock?: number
  isNew?: boolean
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}