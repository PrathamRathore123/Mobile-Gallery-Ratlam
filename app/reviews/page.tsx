"use client"

import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { Star, ThumbsUp, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveReviews } from "@/lib/hooks/use-reviews"

export default function ReviewsPage() {
  const { data: reviews, loading, error } = useActiveReviews()

  const total = reviews.length
  const average = total === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / total
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100)
    return { stars, percentage }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8"><h1 className="mb-2 text-3xl font-bold md:text-4xl">Customer Reviews</h1><p className="text-muted-foreground">See what our customers are saying about us</p></div>

          {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

          <div className="mb-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold">{average.toFixed(1)}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`size-5 ${index < Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />)}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{total.toLocaleString()} reviews</p>
                </div>
                <div className="flex-1 space-y-2">{breakdown.map(({ stars, percentage }) => <div key={stars} className="flex items-center gap-2"><span className="w-6 text-sm">{stars}</span><Star className="size-3 fill-yellow-400 text-yellow-400" /><div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-yellow-400" style={{ width: `${percentage}%` }} /></div><span className="w-10 text-sm text-muted-foreground">{percentage}%</span></div>)}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-secondary p-6 md:p-8">
              <h3 className="mb-4 text-lg font-semibold">Why Customers Trust Us</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-background p-4"><p className="text-2xl font-bold text-accent">{total}+</p><p className="text-sm text-muted-foreground">Happy Customers</p></div>
                <div className="rounded-xl bg-background p-4"><p className="text-2xl font-bold text-accent">{Math.round(average * 20)}%</p><p className="text-sm text-muted-foreground">Positive Score</p></div>
                <div className="rounded-xl bg-background p-4"><p className="text-2xl font-bold text-accent">24/7</p><p className="text-sm text-muted-foreground">WhatsApp Support</p></div>
                <div className="rounded-xl bg-background p-4"><p className="text-2xl font-bold text-accent">100%</p><p className="text-sm text-muted-foreground">Authentic Products</p></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />) : null}
            {!loading ? reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-semibold">{review.customerName.slice(0, 1).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{review.customerName}</h3><span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600"><CheckCircle className="size-3" />Verified</span></div>
                    <div className="mt-1 flex items-center gap-2"><div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`size-4 ${index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />)}</div>{review.createdAt ? <span className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</span> : null}</div>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{review.comment}</p>
                    <div className="mt-4 border-t border-border pt-4"><button className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ThumbsUp className="size-4" />Helpful</button></div>
                  </div>
                </div>
              </div>
            )) : null}
          </div>

          {!loading && reviews.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No reviews available yet.</p> : null}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
