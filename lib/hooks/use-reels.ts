"use client"

import { useCallback, useEffect, useState } from "react"
import type { Reel } from "@/lib/types/entities"
import { listActiveReels, listReels } from "@/lib/services/reels"

function useReelLoader(loader: () => Promise<Reel[]>) {
  const [data, setData] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setData(await loader())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reels")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

export function useReels() {
  return useReelLoader(listReels)
}

export function useActiveReels() {
  return useReelLoader(listActiveReels)
}
