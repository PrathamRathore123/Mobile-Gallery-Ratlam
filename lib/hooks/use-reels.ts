"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Reel } from "@/lib/types/entities"
import { listActiveReels, listReels } from "@/lib/services/reels"

function useReelLoader(loader: () => Promise<Reel[]>) {
  const [data, setData] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)

  const refresh = useCallback(async () => {
    try {
      if (!hasLoadedRef.current) {
        setLoading(true)
      }
      setError(null)
      setData(await loader())
      hasLoadedRef.current = true
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
