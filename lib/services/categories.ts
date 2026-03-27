import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { COLLECTIONS } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import { booleanOrDefault, numberOrDefault, stringOrDefault, toDate } from "@/lib/firebase/parsers"
import type { Category, CategoryInput } from "@/lib/types/entities"

const categoriesRef = collection(db, COLLECTIONS.categories)

function mapCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: stringOrDefault(data.name),
    slug: stringOrDefault(data.slug),
    image: stringOrDefault(data.image),
    active: booleanOrDefault(data.active, true),
    sortOrder: numberOrDefault(data.sortOrder),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

export async function listCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(categoriesRef, orderBy("sortOrder", "asc"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapCategory(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function listActiveCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(categoriesRef, where("active", "==", true), orderBy("sortOrder", "asc"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapCategory(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.categories, id))
  if (!snapshot.exists()) {
    return null
  }
  return mapCategory(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createCategory(input: CategoryInput): Promise<string> {
  const result = await addDoc(categoriesRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return result.id
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.categories, id), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.categories, id))
}
