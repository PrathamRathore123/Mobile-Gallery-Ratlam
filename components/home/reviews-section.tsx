"use client"

import Link from "next/link"
import { Star, Quote } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeaturedReviews } from "@/lib/hooks/use-reviews"

export function ReviewsSection() {
  const { data: reviews, loading, error } = useFeaturedReviews(3)

  return (
    <section className="bg-secondary/50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">What Our Customers Say</h2>
          <p className="mt-2 text-muted-foreground">Trusted by thousands of happy customers</p>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        <div className="grid gap-6 md:grid-cols-3">
          {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />) : null}
          {!loading ? reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
              <Quote className="mb-4 size-8 text-accent/30" />
              <p className="mb-6 leading-relaxed text-foreground/80">{review.comment}</p>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">{review.customerName.slice(0, 1).toUpperCase()}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{review.customerName}</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`size-3 ${index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />)}
                  </div>
                </div>
              </div>
            </div>
          )) : null}
        </div>

        {!loading && reviews.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No featured reviews yet.</p> : null}

        <div className="mt-8 text-center">
          <Link href="/reviews" className="inline-flex items-center gap-2 font-medium text-accent hover:underline">Read All Reviews</Link>
        </div>
      </div>
    </section>
  )
}
