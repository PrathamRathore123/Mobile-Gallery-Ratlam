"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import {
  Package,
  FolderTree,
  Video,
  MessageSquare,
  ArrowRight,
  Eye,
  Users,
  TrendingUp,
  Funnel,
  Filter,
  ArrowUpDown,
  MessageCircle,
} from "lucide-react"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { useReels } from "@/lib/hooks/use-reels"
import { useReviews } from "@/lib/hooks/use-reviews"
import { useWebsiteAnalytics, type AnalyticsRange } from "@/lib/hooks/use-website-analytics"

const cards = [
  { label: "Products", href: "/admin/products", icon: Package, key: "products" },
  { label: "Categories", href: "/admin/categories", icon: FolderTree, key: "categories" },
  { label: "Reels", href: "/admin/reels", icon: Video, key: "reels" },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare, key: "reviews" },
] as const

const rangeButtons: Array<{ label: string; value: AnalyticsRange }> = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
]

const sourceColors = ["#0ea5e9", "#22c55e", "#a855f7", "#f59e0b", "#ef4444", "#64748b"]

export default function AdminDashboard() {
  const { data: products, loading: productsLoading } = useProducts()
  const { data: categories, loading: categoriesLoading } = useCategories()
  const { data: reels, loading: reelsLoading } = useReels()
  const { data: reviews, loading: reviewsLoading } = useReviews()

  const [range, setRange] = useState<AnalyticsRange>("7d")
  const { summary, loading: analyticsLoading, error: analyticsError } = useWebsiteAnalytics(range)

  const map = {
    products: { count: products.length, loading: productsLoading },
    categories: { count: categories.length, loading: categoriesLoading },
    reels: { count: reels.length, loading: reelsLoading },
    reviews: { count: reviews.length, loading: reviewsLoading },
  }

  const topPagesChart = useMemo(
    () =>
      summary.topPages.map((item) => ({
        name: item.label.length > 18 ? `${item.label.slice(0, 18)}...` : item.label,
        views: item.value,
      })),
    [summary.topPages]
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage storefront content and monitor real-time website analytics.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
              <p className="text-2xl font-bold">{info.loading ? "..." : info.count.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Website Analytics</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live events from public website traffic and user actions.</p>
          </div>
          <div className="-mx-1 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2 px-1">
              {rangeButtons.map((item) => (
                <Button
                  key={item.value}
                  variant={range === item.value ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl whitespace-nowrap"
                  onClick={() => setRange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {analyticsError ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{analyticsError}</div>
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

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 text-sm font-semibold">Views Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.viewsTrend}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 text-sm font-semibold">Top Pages</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPagesChart}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Funnel className="size-4" />Conversion Funnel</h3>
            <div className="space-y-2">
              {summary.funnel.map((step) => (
                <div key={step.eventType} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span>{step.label}</span>
                  <span className="font-semibold">{step.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                <p className="text-muted-foreground">View -&gt; Product</p>
                <p className="text-lg font-semibold">{summary.conversions.viewToProduct}%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                <p className="text-muted-foreground">Product -&gt; Cart</p>
                <p className="text-lg font-semibold">{summary.conversions.productToCart}%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                <p className="text-muted-foreground">Cart -&gt; WhatsApp</p>
                <p className="text-lg font-semibold">{summary.conversions.cartToWhatsapp}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 text-sm font-semibold">Traffic Sources</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={summary.topSources} dataKey="value" nameKey="label" outerRadius={72} innerRadius={38} paddingAngle={2}>
                      {summary.topSources.map((item, index) => (
                        <Cell key={item.label} fill={sourceColors[index % sourceColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {summary.topSources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No source data yet.</p>
                ) : (
                  summary.topSources.map((source, index) => (
                    <div key={source.label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: sourceColors[index % sourceColors.length] }} />
                        <span>{source.label}</span>
                      </div>
                      <span className="font-medium">{source.value.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Filter className="size-4 text-accent" />Filter Actions</div>
            <p className="text-2xl font-bold">{summary.eventCounts.filters.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><ArrowUpDown className="size-4 text-accent" />Sort Changes</div>
            <p className="text-2xl font-bold">{summary.eventCounts.sortChanges.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><MessageCircle className="size-4 text-accent" />Review Submits</div>
            <p className="text-2xl font-bold">{summary.eventCounts.reviewSubmits.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
        <h2 className="text-lg font-semibold">Next step</h2>
        <p className="mt-2 text-sm text-muted-foreground">Open settings to configure business name, WhatsApp number, and hero text for the storefront.</p>
        <Button asChild className="mt-4 rounded-xl">
          <Link href="/admin/settings">Open Settings</Link>
        </Button>
      </div>
    </div>
  )
}
