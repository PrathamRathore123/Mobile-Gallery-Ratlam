import { collection, doc, getDocs, limit, query, serverTimestamp, writeBatch } from "firebase/firestore"
import { COLLECTIONS, SETTINGS_DOC_ID } from "@/lib/constants/collections"
import { seedCategories, seedProducts, seedReels, seedReviews } from "@/lib/constants/seed-data"
import { db } from "@/lib/firebase/client"

async function collectionHasData(collectionName: string): Promise<boolean> {
  const snapshot = await getDocs(query(collection(db, collectionName), limit(1)))
  return !snapshot.empty
}

export async function seedInitialData(options?: { force?: boolean }) {
  const force = Boolean(options?.force)

  const [hasCategories, hasProducts, hasReels, hasReviews] = await Promise.all([
    collectionHasData(COLLECTIONS.categories),
    collectionHasData(COLLECTIONS.products),
    collectionHasData(COLLECTIONS.reels),
    collectionHasData(COLLECTIONS.reviews),
  ])

  const batch = writeBatch(db)

  let categoriesSeeded = 0
  let productsSeeded = 0
  let reelsSeeded = 0
  let reviewsSeeded = 0

  if (force || !hasCategories) {
    seedCategories.forEach((category) => {
      const ref = doc(db, COLLECTIONS.categories, category.id)
      batch.set(ref, { ...category, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
      categoriesSeeded += 1
    })
  }

  if (force || !hasProducts) {
    seedProducts.forEach((product) => {
      const ref = doc(db, COLLECTIONS.products, product.id)
      batch.set(ref, { ...product, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
      productsSeeded += 1
    })
  }

  if (force || !hasReels) {
    seedReels.forEach((reel) => {
      const ref = doc(db, COLLECTIONS.reels, reel.id)
      batch.set(ref, { ...reel, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
      reelsSeeded += 1
    })
  }

  if (force || !hasReviews) {
    seedReviews.forEach((review) => {
      const ref = doc(db, COLLECTIONS.reviews, review.id)
      batch.set(ref, { ...review, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
      reviewsSeeded += 1
    })
  }

  const settingsRef = doc(db, COLLECTIONS.settings, SETTINGS_DOC_ID)
  batch.set(
    settingsRef,
    {
      businessName: "Mobile Gallery",
      whatsappNumber: "919876543210",
      instagramUrl: "https://instagram.com/mobilegallery",
      heroTitle: "Premium smartphones for modern life",
      heroSubtitle: "Discover flagship phones and accessories with quick WhatsApp support.",
      supportText: "Need help choosing a device? Chat with us on WhatsApp.",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  await batch.commit()

  return {
    categoriesSeeded,
    productsSeeded,
    reelsSeeded,
    reviewsSeeded,
    skipped: {
      categories: !force && hasCategories,
      products: !force && hasProducts,
      reels: !force && hasReels,
      reviews: !force && hasReviews,
    },
  }
}
