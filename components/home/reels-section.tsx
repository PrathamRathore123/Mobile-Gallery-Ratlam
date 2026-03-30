"use client"

import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveReels } from "@/lib/hooks/use-reels"

export function ReelsSection() {
  const { data: reels, loading, error } = useActiveReels()

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Latest Reels</h2>
            <p className="mt-1 text-muted-foreground">Watch our latest product reviews</p>
          </div>
          <Link href="/reels" className="text-sm font-medium text-accent hover:underline">View All</Link>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
          {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[9/16] w-[160px] rounded-2xl md:w-[200px]" />) : null}
          {!loading ? reels.map((reel) => (
            <a key={reel.id} href={reel.reelUrl} target="_blank" rel="noreferrer" className="group w-[160px] flex-shrink-0 md:w-[200px]">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-secondary">
                <Image src={reel.thumbnail || "/placeholder.jpg"} alt={reel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="flex size-12 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm transition-transform group-hover:scale-110"><Play className="ml-0.5 size-5 fill-white text-white" /></div></div>
                <div className="absolute bottom-0 left-0 right-0 p-3"><p className="mb-1 line-clamp-2 text-sm font-medium text-white">{reel.title}</p></div>
              </div>
            </a>
          )) : null}
        </div>

        {!loading && reels.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No reels added yet.</p> : null}
      </div>
    </section>
  )
}
