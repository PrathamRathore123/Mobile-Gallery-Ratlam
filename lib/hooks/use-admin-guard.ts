"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/lib/firebase/client"
import { getAdminByUid } from "@/lib/services/admins"
import type { AdminUser } from "@/lib/types/entities"

interface UseAdminGuardResult {
  loading: boolean
  user: User | null
  admin: AdminUser | null
  isAuthorized: boolean
}

export function useAdminGuard(): UseAdminGuardResult {
  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<AdminUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null)
        setAdmin(null)
        setLoading(false)
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
        return
      }

      const adminDoc = await getAdminByUid(nextUser.uid)
      if (!adminDoc || !adminDoc.active) {
        setUser(nextUser)
        setAdmin(null)
        setLoading(false)
        router.replace("/admin/login?error=unauthorized")
        return
      }

      setUser(nextUser)
      setAdmin(adminDoc)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [pathname, router])

  return {
    loading,
    user,
    admin,
    isAuthorized: Boolean(user && admin?.active),
  }
}
