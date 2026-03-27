"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, FolderTree, Video, MessageSquare, ArrowRight } from "lucide-react"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { useReels } from "@/lib/hooks/use-reels"
import { useReviews } from "@/lib/hooks/use-reviews"

const cards = [
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    key: "products",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    key: "categories",
  },
  {
    label: "Reels",
    href: "/admin/reels",
    icon: Video,
    key: "reels",
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
    key: "reviews",
  },
] as const

export default function AdminDashboard() {
  const { data: products, loading: productsLoading } = useProducts()
  const { data: categories, loading: categoriesLoading } = useCategories()
  const { data: reels, loading: reelsLoading } = useReels()
  const { data: reviews, loading: reviewsLoading } = useReviews()

  const map = {
    products: { count: products.length, loading: productsLoading },
    categories: { count: categories.length, loading: categoriesLoading },
    reels: { count: reels.length, loading: reelsLoading },
    reviews: { count: reviews.length, loading: reviewsLoading },
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all storefront content from one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          const info = map[card.key]

          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="size-5 text-accent" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {info.loading ? "..." : info.count.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Next step</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Open settings to configure business name, WhatsApp number, and hero text for the storefront.
        </p>
        <Button asChild className="mt-4 rounded-xl">
          <Link href="/admin/settings">Open Settings</Link>
        </Button>
      </div>
    </div>
  )
}
