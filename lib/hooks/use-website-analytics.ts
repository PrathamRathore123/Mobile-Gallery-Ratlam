"use client"

import { useEffect, useMemo, useState } from "react"
import type { AnalyticsEvent, AnalyticsEventType } from "@/lib/types/entities"
import { listAnalyticsEvents, subscribeAnalyticsEvents } from "@/lib/services/analytics"

export type AnalyticsRange = "today" | "7d" | "30d"

interface AnalyticsPoint {
  label: string
  value: number
}

interface FunnelStep {
  label: string
  eventType: AnalyticsEventType
  count: number
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getRangeStart(range: AnalyticsRange): Date {
  const now = new Date()
  const today = startOfDay(now)

  switch (range) {
    case "today":
      return today
    case "7d":
      return new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
    default:
      return today
  }
}

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
}

function referrerHost(referrer: string | null): string {
  if (!referrer) return "Direct"
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "")
    return host || "Direct"
  } catch {
    return "Unknown"
  }
}

export function useWebsiteAnalytics(range: AnalyticsRange = "7d") {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeAnalyticsEvents(
      (data) => {
        setEvents(data)
        setLoading(false)
      },
      (err) => {
        setError(err instanceof Error ? err.message : "Failed to load website analytics")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const refresh = async () => {
    try {
      setError(null)
      const data = await listAnalyticsEvents()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh website analytics")
    }
  }

  const summary = useMemo(() => {
    const rangeStart = getRangeStart(range)
    const filtered = events.filter((event) => {
      if (!event.createdAt) return false
      return event.createdAt >= rangeStart
    })

    const pageViews = filtered.filter((event) => event.eventType === "page_view")
    const totalPageViews = pageViews.length
    const uniqueVisitors = new Set(pageViews.map((event) => event.sessionId)).size

    const today = startOfDay(new Date())
    const todayViews = pageViews.filter((event) => {
      if (!event.createdAt) return false
      return event.createdAt >= today
    }).length

    const pathMap = new Map<string, number>()
    pageViews.forEach((event) => {
      const current = pathMap.get(event.pagePath) ?? 0
      pathMap.set(event.pagePath, current + 1)
    })

    const topPages: AnalyticsPoint[] = Array.from(pathMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)

    const sourceMap = new Map<string, number>()
    pageViews.forEach((event) => {
      const source = referrerHost(event.referrer)
      const current = sourceMap.get(source) ?? 0
      sourceMap.set(source, current + 1)
    })

    const topSources: AnalyticsPoint[] = Array.from(sourceMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    const rangeDays = range === "today" ? 1 : range === "7d" ? 7 : 30
    const dayMap = new Map<string, number>()
    for (let i = rangeDays - 1; i >= 0; i -= 1) {
      const date = new Date(startOfDay(new Date()).getTime() - i * 24 * 60 * 60 * 1000)
      dayMap.set(toDayKey(date), 0)
    }
    pageViews.forEach((event) => {
      if (!event.createdAt) return
      const key = toDayKey(startOfDay(event.createdAt))
      if (!dayMap.has(key)) return
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
    })

    const viewsTrend: AnalyticsPoint[] = Array.from(dayMap.entries()).map(([key, value]) => {
      const [year, month, day] = key.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return { label: dayLabel(date), value }
    })

    const count = (eventType: AnalyticsEventType) => filtered.filter((event) => event.eventType === eventType).length
    const funnel: FunnelStep[] = [
      { label: "Page Views", eventType: "page_view", count: count("page_view") },
      { label: "Product Views", eventType: "product_view", count: count("product_view") },
      { label: "Add To Cart", eventType: "add_to_cart", count: count("add_to_cart") },
      { label: "WhatsApp Clicks", eventType: "whatsapp_click", count: count("whatsapp_click") },
    ]

    const conversions = {
      viewToProduct:
        funnel[0].count > 0 ? Number(((funnel[1].count / funnel[0].count) * 100).toFixed(1)) : 0,
      productToCart:
        funnel[1].count > 0 ? Number(((funnel[2].count / funnel[1].count) * 100).toFixed(1)) : 0,
      cartToWhatsapp:
        funnel[2].count > 0 ? Number(((funnel[3].count / funnel[2].count) * 100).toFixed(1)) : 0,
    }

    return {
      filteredEvents: filtered,
      totalPageViews,
      uniqueVisitors,
      todayViews,
      topPages,
      topSources,
      viewsTrend,
      funnel,
      conversions,
      eventCounts: {
        reviewSubmits: count("review_submit"),
        filters: count("shop_filter"),
        sortChanges: count("shop_sort"),
      },
    }
  }, [events, range])

  return {
    events,
    summary,
    loading,
    error,
    refresh,
  }
}

