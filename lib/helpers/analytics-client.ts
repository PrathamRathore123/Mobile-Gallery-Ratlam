"use client"

import type { AnalyticsEventType } from "@/lib/types/entities"
import { trackAnalyticsEvent } from "@/lib/services/analytics"

const SESSION_KEY = "mg_analytics_session_id"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const created = `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  window.sessionStorage.setItem(SESSION_KEY, created)
  return created
}

interface TrackClientEventInput {
  eventType: AnalyticsEventType
  productId?: string | null
  value?: number | null
  extra?: string | null
  pagePath?: string
}

export async function trackClientEvent({
  eventType,
  productId = null,
  value = null,
  extra = null,
  pagePath,
}: TrackClientEventInput): Promise<void> {
  if (typeof window === "undefined") return
  const sessionId = getSessionId()
  if (!sessionId) return

  const finalPath = pagePath || window.location.pathname
  const referrer = document.referrer || null

  await trackAnalyticsEvent({
    eventType,
    pagePath: finalPath,
    sessionId,
    referrer,
    productId,
    value,
    extra,
  })
}

