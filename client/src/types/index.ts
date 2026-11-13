export interface Category {
  id: string
  name: string
  description?: string
}

export interface Store {
  id: string
  name: string
  description?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  images?: string[]
  imageUrl?: string
  categoryName: string
  storeName: string
  storeId: string
  stock: number
  sku?: string
  reviewCount?: number
  avgRating?: number
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  priceAtPurchase: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  shippingAddress: string
  totalAmount: number
  items: OrderItem[]
}

export interface Review {
  id: string
  rating: number
  comment: string
  authorName: string
  authorId?: string
  createdAt: string
}