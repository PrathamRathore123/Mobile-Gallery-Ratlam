"use client"

import { useCallback, useEffect, useState } from "react"
import type { AppSettings } from "@/lib/types/entities"
import { defaultSettings, getSettings } from "@/lib/services/settings"

export function useAppSettings() {
  const [data, setData] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getSettings()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}
