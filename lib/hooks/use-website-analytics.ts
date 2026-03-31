"use client"

import { useEffect, useMemo, useState } from "react"
import type { AnalyticsEvent } from "@/lib/types/entities"
import { listAnalyticsEvents, subscribeAnalyticsEvents } from "@/lib/services/analytics"

interface TopPage {
  path: string
  views: number
}

function isSameDay(date: Date, target: Date): boolean {
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth() &&
    date.getDate() === target.getDate()
  )
}

export function useWebsiteAnalytics() {
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

    return () => {
      unsubscribe()
    }
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
    const pageViews = events.filter((event) => event.eventType === "page_view")
    const totalPageViews = pageViews.length
    const uniqueVisitors = new Set(pageViews.map((event) => event.sessionId)).size

    const today = new Date()
    const todayViews = pageViews.filter((event) => (event.createdAt ? isSameDay(event.createdAt, today) : false)).length

    const pathMap = new Map<string, number>()
    pageViews.forEach((event) => {
      const current = pathMap.get(event.pagePath) ?? 0
      pathMap.set(event.pagePath, current + 1)
    })

    const topPages: TopPage[] = Array.from(pathMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    return {
      totalPageViews,
      uniqueVisitors,
      todayViews,
      topPages,
    }
  }, [events])

  return {
    events,
    summary,
    loading,
    error,
    refresh,
  }
}
