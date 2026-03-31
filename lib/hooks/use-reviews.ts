"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Review } from "@/lib/types/entities"
import { listActiveReviews, listFeaturedReviews, listReviews, subscribeActiveReviews, subscribeReviews } from "@/lib/services/reviews"

type ReviewSubscriber = (
  onData: (reviews: Review[]) => void,
  onError?: (error: Error) => void
) => () => void

function useReviewLoader(loader: () => Promise<Review[]>, subscriber?: ReviewSubscriber) {
  const [data, setData] = useState<Review[]>([])
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
      setError(err instanceof Error ? err.message : "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    if (!subscriber) {
      void refresh()
      return
    }

    setError(null)
    const unsubscribe = subscriber(
      (reviews) => {
        setData(reviews)
        hasLoadedRef.current = true
        setLoading(false)
      },
      (err) => {
        setError(err instanceof Error ? err.message : "Failed to load reviews")
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [refresh, subscriber])

  return { data, loading, error, refresh }
}

export function useReviews() {
  return useReviewLoader(listReviews, subscribeReviews)
}

export function useActiveReviews() {
  return useReviewLoader(listActiveReviews, subscribeActiveReviews)
}

export function useFeaturedReviews(max = 3) {
  const loader = useCallback(() => listFeaturedReviews(max), [max])
  const subscriber = useCallback<ReviewSubscriber>(
    (onData, onError) =>
      subscribeActiveReviews(
        (reviews) => {
          onData(reviews.filter((review) => review.featured).slice(0, max))
        },
        onError
      ),
    [max]
  )

  return useReviewLoader(loader, subscriber)
}
