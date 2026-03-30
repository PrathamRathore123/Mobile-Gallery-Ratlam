import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { COLLECTIONS } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import { booleanOrDefault, numberOrDefault, stringOrDefault, toDate } from "@/lib/firebase/parsers"
import type { Review, ReviewInput } from "@/lib/types/entities"

const reviewsRef = collection(db, COLLECTIONS.reviews)

function mapReview(id: string, data: Record<string, unknown>): Review {
  const sourceUrl = data.sourceUrl
  const productId = data.productId

  return {
    id,
    customerName: stringOrDefault(data.customerName),
    rating: numberOrDefault(data.rating, 5),
    comment: stringOrDefault(data.comment),
    sourceUrl: typeof sourceUrl === "string" ? sourceUrl : null,
    productId: typeof productId === "string" ? productId : null,
    featured: booleanOrDefault(data.featured),
    active: booleanOrDefault(data.active, true),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

function compareByCreatedAtDesc(a: Review, b: Review): number {
  const aCreated = a.createdAt?.getTime() ?? 0
  const bCreated = b.createdAt?.getTime() ?? 0
  return bCreated - aCreated
}

export async function listReviews(): Promise<Review[]> {
  const snapshot = await getDocs(reviewsRef)
  return snapshot.docs
    .map((docItem) => mapReview(docItem.id, docItem.data() as Record<string, unknown>))
    .sort(compareByCreatedAtDesc)
}

export async function listActiveReviews(): Promise<Review[]> {
  const snapshot = await getDocs(query(reviewsRef, where("active", "==", true)))
  return snapshot.docs
    .map((docItem) => mapReview(docItem.id, docItem.data() as Record<string, unknown>))
    .sort(compareByCreatedAtDesc)
}

export async function listFeaturedReviews(max = 6): Promise<Review[]> {
  const reviews = await listActiveReviews()
  return reviews
    .filter((review) => review.featured)
    .slice(0, max)
}

export async function getReviewById(id: string): Promise<Review | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.reviews, id))
  if (!snapshot.exists()) {
    return null
  }
  return mapReview(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createReview(input: ReviewInput): Promise<string> {
  const result = await addDoc(reviewsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return result.id
}

export async function updateReview(id: string, input: Partial<ReviewInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.reviews, id), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.reviews, id))
}
