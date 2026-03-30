"use client"

import { useCallback, useEffect, useState } from "react"
import type { Product } from "@/lib/types/entities"
import {
  getProductById,
  getProductBySlug,
  listActiveProducts,
  listFeaturedProducts,
  listProducts,
} from "@/lib/services/products"

interface DataState<T> {
  data: T
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

function useProductsLoader(loader: () => Promise<Product[]>): DataState<Product[]> {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await loader()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

export function useProducts() {
  return useProductsLoader(listProducts)
}

export function useActiveProducts() {
  return useProductsLoader(listActiveProducts)
}

export function useFeaturedProducts(max = 4) {
  const loader = useCallback(() => listFeaturedProducts(max), [max])
  return useProductsLoader(loader)
}

export function useProductById(productId: string) {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setData(await getProductById(productId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product")
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (!productId) return
    void refresh()
  }, [productId, refresh])

  return { data, loading, error, refresh }
}

export function useProductBySlug(slug: string) {
  const [data, setData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setData(await getProductBySlug(slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product")
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (!slug) return
    void refresh()
  }, [slug, refresh])

  return { data, loading, error, refresh }
}
