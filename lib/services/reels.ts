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
import type { Reel, ReelInput } from "@/lib/types/entities"

const reelsRef = collection(db, COLLECTIONS.reels)

function mapReel(id: string, data: Record<string, unknown>): Reel {
  return {
    id,
    title: stringOrDefault(data.title),
    reelUrl: stringOrDefault(data.reelUrl),
    thumbnail: stringOrDefault(data.thumbnail),
    caption: stringOrDefault(data.caption),
    active: booleanOrDefault(data.active, true),
    featured: booleanOrDefault(data.featured),
    sortOrder: numberOrDefault(data.sortOrder),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

export async function listReels(): Promise<Reel[]> {
  const snapshot = await getDocs(query(reelsRef, orderBy("sortOrder", "asc"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapReel(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function listActiveReels(): Promise<Reel[]> {
  const snapshot = await getDocs(query(reelsRef, where("active", "==", true), orderBy("sortOrder", "asc"), orderBy("createdAt", "desc")))
  return snapshot.docs.map((docItem) => mapReel(docItem.id, docItem.data() as Record<string, unknown>))
}

export async function getReelById(id: string): Promise<Reel | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.reels, id))
  if (!snapshot.exists()) {
    return null
  }
  return mapReel(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function createReel(input: ReelInput): Promise<string> {
  const result = await addDoc(reelsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return result.id
}

export async function updateReel(id: string, input: Partial<ReelInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.reels, id), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteReel(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.reels, id))
}
