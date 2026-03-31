"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, FolderTree, Video, MessageSquare, ArrowRight, Eye, Users, TrendingUp } from "lucide-react"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { useReels } from "@/lib/hooks/use-reels"
import { useReviews } from "@/lib/hooks/use-reviews"
import { useWebsiteAnalytics } from "@/lib/hooks/use-website-analytics"

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
  const { summary, loading: analyticsLoading, error: analyticsError } = useWebsiteAnalytics()

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
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Website Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Live public website traffic from Firestore events.</p>
        </div>

        {analyticsError ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {analyticsError}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Page Views</p>
              <Eye className="size-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{analyticsLoading ? "..." : summary.totalPageViews.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <Users className="size-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{analyticsLoading ? "..." : summary.uniqueVisitors.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Today&apos;s Views</p>
              <TrendingUp className="size-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{analyticsLoading ? "..." : summary.todayViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold">Top Pages</h3>
          <div className="mt-3 space-y-2">
            {analyticsLoading ? (
              <p className="text-sm text-muted-foreground">Loading page analytics...</p>
            ) : summary.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No page view data yet.</p>
            ) : (
              summary.topPages.map((page) => (
                <div key={page.path} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{page.path}</span>
                  <span className="font-medium">{page.views.toLocaleString()} views</span>
                </div>
              ))
            )}
          </div>
        </div>
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
