"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackClientEvent } from "@/lib/helpers/analytics-client"

const LAST_TRACK_KEY = "mg_analytics_last_track"

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

    void trackClientEvent({
      eventType: "page_view",
      pagePath: pathname,
    }).catch(() => {
      // Intentionally ignore tracking failures to avoid impacting UX.
    })
  }, [pathname])

  return null
}
