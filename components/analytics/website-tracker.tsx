"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackPageView } from "@/lib/services/analytics"

const SESSION_KEY = "mg_analytics_session_id"
const LAST_TRACK_KEY = "mg_analytics_last_track"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const created = `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  window.sessionStorage.setItem(SESSION_KEY, created)
  return created
}

export function WebsiteTracker() {
  const pathname = usePathname()
  const lastTrackedPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith("/admin")) return
    if (lastTrackedPathRef.current === pathname) return
    lastTrackedPathRef.current = pathname

    if (typeof window !== "undefined") {
      const now = Date.now()
      const raw = window.sessionStorage.getItem(LAST_TRACK_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { path?: string; time?: number }
          if (parsed.path === pathname && typeof parsed.time === "number" && now - parsed.time < 3000) {
            return
          }
        } catch {
          // ignore malformed cache
        }
      }
      window.sessionStorage.setItem(LAST_TRACK_KEY, JSON.stringify({ path: pathname, time: now }))
    }

    const sessionId = getSessionId()
    if (!sessionId) return

    void trackPageView({
      pagePath: pathname,
      sessionId,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    }).catch(() => {
      // Intentionally ignore tracking failures to avoid impacting UX.
    })
  }, [pathname])

  return null
}
