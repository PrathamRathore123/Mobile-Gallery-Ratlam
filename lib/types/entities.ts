export type AdminRole = "owner" | "manager"

export interface AdminUser {
  uid: string
  email: string
  role: AdminRole
  active: boolean
  createdAt: Date | null
}

export interface ProductSpecification {
  label: string
  value: string
}

export type StockStatus = "in_stock" | "out_of_stock" | "preorder"

export interface Product {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  brand: string
  price: number
  salePrice: number | null
  categoryId: string
  images: string[]
  highlights: string[]
  specifications: ProductSpecification[]
  colors: string[]
  storageOptions: string[]
  rating: number
  reviewCount: number
  featured: boolean
  active: boolean
  stockStatus: StockStatus
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  active: boolean
  sortOrder: number
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Reel {
  id: string
  title: string
  reelUrl: string
  thumbnail: string
  caption: string
  active: boolean
  featured: boolean
  sortOrder: number
  createdAt: Date | null
  updatedAt: Date | null
}

export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  sourceUrl: string | null
  productId: string | null
  featured: boolean
  active: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

export interface AppSettings {
  businessName: string
  whatsappNumber: string
  instagramUrl: string
  heroTitle: string
  heroSubtitle: string
  supportText: string
  updatedAt: Date | null
}

export interface ProductInput {
  title: string
  slug: string
  shortDescription: string
  fullDescription: string
  brand: string
  price: number
  salePrice: number | null
  categoryId: string
  images: string[]
  highlights: string[]
  specifications: ProductSpecification[]
  colors: string[]
  storageOptions: string[]
  rating: number
  reviewCount: number
  featured: boolean
  active: boolean
  stockStatus: StockStatus
}

export interface CategoryInput {
  name: string
  slug: string
  image: string
  active: boolean
  sortOrder: number
}

export interface ReelInput {
  title: string
  reelUrl: string
  thumbnail: string
  caption: string
  active: boolean
  featured: boolean
  sortOrder: number
}

export interface ReviewInput {
  customerName: string
  rating: number
  comment: string
  sourceUrl: string | null
  productId: string | null
  featured: boolean
  active: boolean
}

export interface PublicReviewInput {
  customerName: string
  rating: number
  comment: string
  sourceUrl?: string | null
}

export interface SettingsInput {
  businessName: string
  whatsappNumber: string
  instagramUrl: string
  heroTitle: string
  heroSubtitle: string
  supportText: string
}

export type AnalyticsEventType = "page_view"

export interface AnalyticsEvent {
  id: string
  eventType: AnalyticsEventType
  pagePath: string
  sessionId: string
  referrer: string | null
  createdAt: Date | null
}
