"use client"

import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Activity,
  Eye,
  Users,
  ShoppingCart,
  MessageCircle,
  Filter,
  ArrowUpDown,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import { useWebsiteAnalytics, type AnalyticsRange } from "@/lib/hooks/use-website-analytics"
import type { AnalyticsEventType } from "@/lib/types/entities"

const rangeButtons: Array<{ label: string; value: AnalyticsRange }> = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
]

const sourceColors = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#64748b"]
const eventColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#6366f1", "#64748b"]

const eventLabelMap: Record<AnalyticsEventType, string> = {
  page_view: "Page View",
  product_view: "Product View",
  add_to_cart: "Add To Cart",
  remove_from_cart: "Remove From Cart",
  whatsapp_click: "WhatsApp Click",
  review_submit: "Review Submit",
  shop_filter: "Shop Filter",
  shop_sort: "Shop Sort",
}

function formatDateTime(date: Date | null): string {
  if (!date) return "Unknown"
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("7d")
  const { data: products } = useProducts()
  const { summary, loading, error } = useWebsiteAnalytics(range)

  const productTitleMap = useMemo(() => {
    const map = new Map<string, string>()
    products.forEach((product) => {
      map.set(product.id, product.title)
    })
    return map
  }, [products])

  const eventBreakdown = useMemo(() => {
    const counts = new Map<AnalyticsEventType, number>()
    summary.filteredEvents.forEach((event) => {
      const current = counts.get(event.eventType) ?? 0
      counts.set(event.eventType, current + 1)
    })

    return Array.from(counts.entries())
      .map(([eventType, count]) => ({
        eventType,
        label: eventLabelMap[eventType],
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [summary.filteredEvents])

  const topProducts = useMemo(() => {
    const map = new Map<
      string,
      {
        views: number
        carts: number
        whatsapp: number
      }
    >()

    summary.filteredEvents.forEach((event) => {
      if (!event.productId) return
      if (event.eventType !== "product_view" && event.eventType !== "add_to_cart" && event.eventType !== "whatsapp_click") return

      const current = map.get(event.productId) ?? { views: 0, carts: 0, whatsapp: 0 }
      if (event.eventType === "product_view") current.views += 1
      if (event.eventType === "add_to_cart") current.carts += 1
      if (event.eventType === "whatsapp_click") current.whatsapp += 1
      map.set(event.productId, current)
    })

    return Array.from(map.entries())
      .map(([productId, stats]) => ({
        productId,
        productName: productTitleMap.get(productId) ?? `Product ${productId.slice(0, 6)}`,
        ...stats,
      }))
      .sort((a, b) => b.views + b.carts * 2 + b.whatsapp * 3 - (a.views + a.carts * 2 + a.whatsapp * 3))
      .slice(0, 8)
  }, [summary.filteredEvents, productTitleMap])

  const recentEvents = useMemo(
    () => summary.filteredEvents.slice(0, 12),
    [summary.filteredEvents]
  )

  const whatsappClicks = useMemo(
    () => summary.filteredEvents.filter((event) => event.eventType === "whatsapp_click").length,
    [summary.filteredEvents]
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Analytics</h1>
          <p className="mt-1 text-muted-foreground">Live performance and user behavior across the storefront.</p>
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

      {error ? (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <Activity className="size-4 text-accent" />
          </div>
          <p className="text-2xl font-bold">{loading ? "..." : summary.filteredEvents.length.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page Views</p>
            <Eye className="size-4 text-accent" />
          </div>
          <p className="text-2xl font-bold">{loading ? "..." : summary.totalPageViews.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Unique Visitors</p>
            <Users className="size-4 text-accent" />
          </div>
          <p className="text-2xl font-bold">{loading ? "..." : summary.uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">WhatsApp Clicks</p>
            <MessageCircle className="size-4 text-accent" />
          </div>
          <p className="text-2xl font-bold">{loading ? "..." : whatsappClicks.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Views Trend</h2>
          <div className="overflow-x-auto">
            <div className="h-64 min-w-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.viewsTrend}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#0ea5e933" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Event Distribution</h2>
          <div className="overflow-x-auto">
            <div className="h-64 min-w-[520px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {eventBreakdown.map((item, index) => (
                      <Cell key={item.eventType} fill={eventColors[index % eventColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Conversion Funnel</h2>
          <div className="space-y-2">
            {summary.funnel.map((step) => (
              <div key={step.eventType} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <span>{step.label}</span>
                <span className="font-semibold">{step.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
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

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Traffic Sources</h2>
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

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Top Products By Engagement</h2>
          <div className="space-y-2">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product events yet.</p>
            ) : (
              topProducts.map((item) => (
                <div key={item.productId} className="rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                    <p className="flex items-center gap-1"><Eye className="size-3.5" />{item.views} views</p>
                    <p className="flex items-center gap-1"><ShoppingCart className="size-3.5" />{item.carts} carts</p>
                    <p className="flex items-center gap-1"><Package className="size-3.5" />{item.whatsapp} WA</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Recent Activity</h2>
          <div className="space-y-2">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events in this range yet.</p>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium">{eventLabelMap[event.eventType]}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</p>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{event.pagePath || "/"}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Filter className="size-4 text-accent" />Filter Actions</div>
          <p className="text-2xl font-bold">{summary.eventCounts.filters.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><ArrowUpDown className="size-4 text-accent" />Sort Changes</div>
          <p className="text-2xl font-bold">{summary.eventCounts.sortChanges.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><MessageCircle className="size-4 text-accent" />Review Submits</div>
          <p className="text-2xl font-bold">{summary.eventCounts.reviewSubmits.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
