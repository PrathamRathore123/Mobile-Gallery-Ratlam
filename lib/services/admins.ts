import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { COLLECTIONS } from "@/lib/constants/collections"
import { db } from "@/lib/firebase/client"
import type { AdminRole, AdminUser } from "@/lib/types/entities"
import { booleanOrDefault, stringOrDefault, toDate } from "@/lib/firebase/parsers"

function mapAdmin(uid: string, data: Record<string, unknown>): AdminUser {
  const role = stringOrDefault(data.role, "manager") as AdminRole
  return {
    uid,
    email: stringOrDefault(data.email),
    role: role === "owner" ? "owner" : "manager",
    active: booleanOrDefault(data.active, false),
    createdAt: toDate(data.createdAt),
  }
}

export async function getAdminByUid(uid: string): Promise<AdminUser | null> {
  const ref = doc(db, COLLECTIONS.admins, uid)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) {
    return null
  }
  return mapAdmin(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function isActiveAdmin(uid: string): Promise<boolean> {
  const admin = await getAdminByUid(uid)
  return Boolean(admin?.active)
}

export async function upsertAdmin(admin: {
  uid: string
  email: string
  role?: AdminRole
  active?: boolean
}) {
  const ref = doc(db, COLLECTIONS.admins, admin.uid)
  await setDoc(
    ref,
    {
      uid: admin.uid,
      email: admin.email,
      role: admin.role ?? "manager",
      active: admin.active ?? true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
