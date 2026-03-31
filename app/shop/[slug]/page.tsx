"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useProductBySlug, useActiveProducts } from "@/lib/hooks/use-products"
import { useActiveReviews } from "@/lib/hooks/use-reviews"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/lib/helpers/whatsapp"
import { formatINR } from "@/lib/helpers/currency"
import { trackClientEvent } from "@/lib/helpers/analytics-client"
import { Star, ChevronLeft, ChevronRight, Check, ShoppingBag, MessageCircle } from "lucide-react"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { data: product, loading } = useProductBySlug(slug)
  const { data: allProducts } = useActiveProducts()
  const { data: allReviews } = useActiveReviews()
  const { addItem } = useCart()
  const whatsappNumber = useWhatsAppNumber()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedStorage, setSelectedStorage] = useState("")
  const trackedProductViewRef = useRef<string | null>(null)

  const productReviews = useMemo(() => {
    if (!product) return []
    return allReviews.filter((review) => review.productId === product.id)
  }, [allReviews, product])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return allProducts.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4)
  }, [allProducts, product])

  useEffect(() => {
    if (!product) return
    if (trackedProductViewRef.current === product.id) return
    trackedProductViewRef.current = product.id

    void trackClientEvent({
      eventType: "product_view",
      productId: product.id,
      value: product.salePrice ?? product.price,
    }).catch(() => {})
  }, [product])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="mt-2 text-muted-foreground">This product may be inactive or removed.</p>
            <Button asChild className="mt-5 rounded-xl">
              <Link href="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    )
  }

  const isInStock = product.stockStatus === "in_stock"
  const finalPrice = product.salePrice ?? product.price
  const discount = product.salePrice ? Math.round(((product.price - finalPrice) / product.price) * 100) : 0
  const selectedImage = product.images[currentImageIndex] || product.images[0] || "/placeholder.jpg"

  const safeColor = selectedColor || product.colors[0] || undefined
  const safeStorage = selectedStorage || product.storageOptions[0] || undefined

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${safeColor || "default"}-${safeStorage || "default"}`,
      name: product.title,
      price: finalPrice,
      originalPrice: product.salePrice ? product.price : undefined,
      image: product.images[0] || "/placeholder.jpg",
      color: safeColor,
      storage: safeStorage,
    })
  }

  const handleWhatsAppOrder = () => {
    const label = [product.title, safeColor ? `(${safeColor})` : "", safeStorage ? safeStorage : ""].filter(Boolean).join(" ")
    const message = buildWhatsAppOrderMessage({
      items: [{ title: label, quantity: 1, unitPrice: finalPrice }],
      total: finalPrice,
    })

    void trackClientEvent({
      eventType: "whatsapp_click",
      productId: product.id,
      value: finalPrice,
      extra: "product_detail",
    }).catch(() => {})

    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-32 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="group relative aspect-square overflow-hidden rounded-3xl bg-secondary">
                <Image src={selectedImage} alt={product.title} fill className="object-cover" priority />

                {product.images.length > 1 ? (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                ) : null}

                {discount > 0 ? (
                  <span className="absolute left-4 top-4 rounded-xl bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground">
                    -{discount}% OFF
                  </span>
                ) : null}
              </div>

              {product.images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 ${currentImageIndex === index ? "border-accent" : "border-transparent"}`}
                    >
                      <Image src={image} alt={`${product.title} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-1 text-sm font-medium text-accent">{product.brand || "Mobile Gallery"}</p>
                <h1 className="text-2xl font-bold md:text-3xl">{product.title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`size-5 ${index < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{formatINR(finalPrice)}</span>
                {product.salePrice ? <span className="text-xl text-muted-foreground line-through">{formatINR(product.price)}</span> : null}
              </div>

              <div className="flex items-center gap-2">
                <span className={`size-3 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}>
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {product.shortDescription ? <p className="text-muted-foreground">{product.shortDescription}</p> : null}

              {product.highlights.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-semibold">Key Highlights</h3>
                  <ul className="space-y-1.5">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 flex-shrink-0 text-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.colors.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold">Color: <span className="font-normal">{safeColor}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium ${safeColor === color ? "bg-accent text-accent-foreground" : "bg-secondary"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {product.storageOptions.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold">Storage</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium ${safeStorage === storage ? "bg-accent text-accent-foreground" : "bg-secondary"}`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="hidden gap-3 md:flex">
                <Button size="lg" className="h-14 flex-1 gap-2 rounded-2xl" onClick={handleAddToCart} disabled={!isInStock}>
                  <ShoppingBag className="size-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="h-14 flex-1 gap-2 rounded-2xl bg-[#25D366] hover:bg-[#128C7E]"
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle className="size-5" />
                  Order on WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {product.fullDescription ? (
            <div className="mt-12 max-w-3xl">
              <h2 className="text-xl font-bold">Description</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{product.fullDescription}</p>
            </div>
          ) : null}

          {product.specifications.length > 0 ? (
            <div className="mt-10 max-w-3xl">
              <h2 className="text-xl font-bold">Specifications</h2>
              <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-4">
                {product.specifications.map((spec) => (
                  <div key={`${spec.label}-${spec.value}`} className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="text-right font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {productReviews.length > 0 ? (
            <div className="mt-10 max-w-3xl">
              <h2 className="text-xl font-bold">Recent Reviews</h2>
              <div className="mt-4 space-y-3">
                {productReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.customerName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`size-3 ${index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {relatedProducts.length > 0 ? (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
              <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:px-0">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="w-[200px] flex-shrink-0 md:w-auto">
                    <ProductCard product={related} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <div className="safe-area-inset-bottom fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-xl md:hidden">
        <div className="flex gap-3">
          <Button size="lg" className="h-12 flex-1 gap-2 rounded-2xl" onClick={handleAddToCart} disabled={!isInStock}>
            <ShoppingBag className="size-4" />
            Add to Cart
          </Button>
          <Button size="lg" className="h-12 flex-1 gap-2 rounded-2xl bg-[#25D366] hover:bg-[#128C7E]" onClick={handleWhatsAppOrder}>
            <MessageCircle className="size-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  )
}
