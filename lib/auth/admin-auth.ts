import { signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { getAdminByUid } from "@/lib/services/admins"

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AdminAuthError"
  }
}

export async function loginAdmin(email: string, password: string): Promise<User> {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  const admin = await getAdminByUid(credentials.user.uid)

  if (!admin || !admin.active) {
    await signOut(auth)
    throw new AdminAuthError("Your account is not approved for admin access.")
  }

  return credentials.user
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth)
}
