"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveProducts, useFeaturedProducts } from "@/lib/hooks/use-products"

export function TrendingSection() {
  const { data: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts(4)
  const { data: activeProducts, loading: activeLoading, error: activeError } = useActiveProducts()

  const loading = featuredLoading || activeLoading
  const error = featuredError || activeError
  const trendingProducts = featuredProducts.length > 0 ? featuredProducts : activeProducts.slice(0, 4)

  return (
    <section className="bg-secondary/50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Trending Now</h2>
            <p className="mt-1 text-muted-foreground">Most popular products this week</p>
          </div>
          <Button asChild variant="ghost" className="hidden gap-2 md:flex"><Link href="/shop">View All<ArrowRight className="size-4" /></Link></Button>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />) : null}
          {!loading ? trendingProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />) : null}
        </div>

        {!loading && trendingProducts.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No products available yet.</p> : null}
      </div>
    </section>
  )
}
