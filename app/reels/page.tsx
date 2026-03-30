"use client"

import Image from "next/image"
import { useState } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveReels } from "@/lib/hooks/use-reels"
import type { Reel } from "@/lib/types/entities"

export default function ReelsPage() {
  const { data: reels, loading, error } = useActiveReels()
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8"><h1 className="mb-2 text-3xl font-bold md:text-4xl">Reels</h1><p className="text-muted-foreground">Watch our latest product reviews and unboxings</p></div>
          {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {loading ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[9/16] rounded-2xl" />) : null}
            {!loading ? reels.map((reel) => (
              <button key={reel.id} onClick={() => setSelectedReel(reel)} className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-secondary text-left">
                <Image src={reel.thumbnail || "/placeholder.jpg"} alt={reel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center"><div className="flex size-14 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm transition-transform group-hover:scale-110"><Play className="ml-1 size-6 fill-white text-white" /></div></div>
                <div className="absolute bottom-0 left-0 right-0 p-4"><p className="line-clamp-2 text-sm font-medium text-white">{reel.title}</p></div>
              </button>
            )) : null}
          </div>

          {!loading && reels.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">No reels found yet.</p> : null}
        </div>
      </main>
      <Footer />
      <MobileNav />

      {selectedReel ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 p-4">
          <div className="relative w-full max-w-lg">
            <Button variant="ghost" size="icon" className="absolute -top-12 right-0 rounded-full text-white hover:bg-white/10" onClick={() => setSelectedReel(null)}><X className="size-6" /></Button>
            <a href={selectedReel.reelUrl} target="_blank" rel="noreferrer" className="block">
              <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-secondary">
                <Image src={selectedReel.thumbnail || "/placeholder.jpg"} alt={selectedReel.title} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/30"><div className="flex size-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"><Play className="ml-1 size-10 fill-white text-white" /></div></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 to-transparent p-6"><h3 className="text-lg font-bold text-white">{selectedReel.title}</h3><p className="mt-2 line-clamp-2 text-sm text-white/70">{selectedReel.caption}</p></div>
              </div>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}
