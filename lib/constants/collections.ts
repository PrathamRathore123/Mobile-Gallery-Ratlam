export const COLLECTIONS = {
  admins: "admins",
  products: "products",
  categories: "categories",
  reels: "reels",
  reviews: "reviews",
  settings: "settings",
} as const

export const SETTINGS_DOC_ID = "main"

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]
