"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types/entities"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    addItem({
      id: product.id,
      name: product.title,
      price: product.salePrice ?? product.price,
      originalPrice: product.salePrice ? product.price : undefined,
      image: product.images[0] || "/placeholder.jpg",
    })
  }

  const basePrice = product.price
  const finalPrice = product.salePrice ?? basePrice
  const discount = product.salePrice
    ? Math.round(((basePrice - finalPrice) / basePrice) * 100)
    : 0

  const isInStock = product.stockStatus === "in_stock"

  return (
    <Link href={`/shop/${product.slug || product.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          {discount > 0 ? (
            <span className="absolute left-3 top-3 rounded-lg bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
              -{discount}%
            </span>
          ) : null}
          {!isInStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
            </div>
          ) : null}
          <Button
            size="icon"
            className="absolute bottom-3 right-3 size-10 translate-y-2 rounded-xl bg-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="mb-1 text-xs text-muted-foreground">{product.brand || "Mobile"}</p>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-accent">
            {product.title}
          </h3>

          <div className="mb-3 flex items-center gap-1">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${finalPrice.toLocaleString()}</span>
            {product.salePrice ? (
              <span className="text-sm text-muted-foreground line-through">${basePrice.toLocaleString()}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
