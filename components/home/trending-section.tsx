"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useActiveProducts, useFeaturedProducts } from "@/lib/hooks/use-products"

export function TrendingSection() {
  const { data: featuredProducts } = useFeaturedProducts(4)
  const { data: activeProducts } = useActiveProducts()

  const trendingProducts = featuredProducts.length > 0 ? featuredProducts : activeProducts.slice(0, 4)

  return (
    <section className="bg-secondary/50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Trending Now</h2>
            <p className="mt-1 text-muted-foreground">Most popular products this week</p>
          </div>
          <Button asChild variant="ghost" className="hidden gap-2 md:flex">
            <Link href="/shop">
              View All
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild variant="outline" className="gap-2 rounded-2xl">
            <Link href="/shop">
              View All Products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
