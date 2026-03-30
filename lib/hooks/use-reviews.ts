"use client"

import { useCallback, useEffect, useState } from "react"
import type { Review } from "@/lib/types/entities"
import { listActiveReviews, listFeaturedReviews, listReviews } from "@/lib/services/reviews"

function useReviewLoader(loader: () => Promise<Review[]>) {
  const [data, setData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setData(await loader())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

export function useReviews() {
  return useReviewLoader(listReviews)
}

export function useActiveReviews() {
  return useReviewLoader(listActiveReviews)
}

export function useFeaturedReviews(max = 3) {
  const loader = useCallback(() => listFeaturedReviews(max), [max])
  return useReviewLoader(loader)
}
