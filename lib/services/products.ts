import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { COLLECTIONS } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import {
  booleanOrDefault,
  numberOrDefault,
  stringArray,
  stringOrDefault,
  toDate,
} from "@/lib/firebase/parsers"
import type { Product, ProductInput, ProductSpecification, StockStatus } from "@/lib/types/entities"

function mapSpecifications(value: unknown): ProductSpecification[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const spec = item as Record<string, unknown>
      const label = stringOrDefault(spec.label)
      const specValue = stringOrDefault(spec.value)
      if (!label || !specValue) return null
      return { label, value: specValue }
    })
    .filter((item): item is ProductSpecification => Boolean(item))
}

function mapStockStatus(value: unknown): StockStatus {
  if (value === "out_of_stock" || value === "preorder") {
    return value
  }
  return "in_stock"
}

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    title: stringOrDefault(data.title),
    slug: stringOrDefault(data.slug),
    shortDescription: stringOrDefault(data.shortDescription),
    fullDescription: stringOrDefault(data.fullDescription),
    brand: stringOrDefault(data.brand),
    price: numberOrDefault(data.price),
    salePrice: data.salePrice === null ? null : numberOrDefault(data.salePrice, 0),
    categoryId: stringOrDefault(data.categoryId),
    images: stringArray(data.images),
    highlights: stringArray(data.highlights),
    specifications: mapSpecifications(data.specifications),
    colors: stringArray(data.colors),
    storageOptions: stringArray(data.storageOptions),
    rating: numberOrDefault(data.rating, 4.8),
    reviewCount: numberOrDefault(data.reviewCount),
    featured: booleanOrDefault(data.featured),
    active: booleanOrDefault(data.active, true),
    stockStatus: mapStockStatus(data.stockStatus),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

const productsRef = collection(db, COLLECTIONS.products)

export async function listProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsRef, orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapProduct(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function listActiveProducts(): Promise<Product[]> {
  const snapshot = await getDocs(query(productsRef, where("active", "==", true), orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapProduct(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function listFeaturedProducts(max = 4): Promise<Product[]> {
  const snapshot = await getDocs(
    query(productsRef, where("active", "==", true), where("featured", "==", true), orderBy("createdAt", "desc"), limit(max))
  )
  return snapshot.docs.map((docItem) => mapProduct(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.products, id))
  if (!snapshot.exists()) {
    return null
  }
  return mapProduct(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snapshot = await getDocs(
    query(productsRef, where("slug", "==", slug), where("active", "==", true), limit(1))
  )

  if (snapshot.empty) {
    return null
  }

  const docItem = snapshot.docs[0]
  return mapProduct(docItem.id, docItem.data() as Record<string, unknown>)
}

export async function createProduct(input: ProductInput): Promise<string> {
  const result = await addDoc(productsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return result.id
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const ref = doc(db, COLLECTIONS.products, id)
  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.products, id))
}
