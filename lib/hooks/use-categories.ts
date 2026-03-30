"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Category } from "@/lib/types/entities"
import { listActiveCategories, listCategories } from "@/lib/services/categories"

function useCategoryLoader(loader: () => Promise<Category[]>) {
  const [data, setData] = useState<Category[]>([])
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
      setError(err instanceof Error ? err.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

export function useCategories() {
  return useCategoryLoader(listCategories)
}

export function useActiveCategories() {
  return useCategoryLoader(listActiveCategories)
}
