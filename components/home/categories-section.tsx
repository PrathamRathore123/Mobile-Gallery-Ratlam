"use client"

import Link from "next/link"
import {
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Speaker,
  BatteryCharging,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import { useActiveCategories } from "@/lib/hooks/use-categories"
import { useActiveProducts } from "@/lib/hooks/use-products"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphones: Smartphone,
  tablets: Tablet,
  accessories: Headphones,
  wearables: Watch,
  audio: Speaker,
  chargers: BatteryCharging,
}

export function CategoriesSection() {
  const { data: categories } = useActiveCategories()
  const { data: products } = useActiveProducts()

  const counts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] || 0) + 1
    return acc
  }, {})

  return (
    <section className="section-space pt-10 md:pt-14">
      <div className="container mx-auto px-4">
        <BackgroundBeamsWithCollision className="h-auto min-h-[22rem] rounded-[2rem] border border-border/60 bg-gradient-to-b from-background via-secondary/35 to-background shadow-[0_16px_60px_rgba(15,23,42,0.08)] md:min-h-[26rem]">
          <div className="relative z-20 w-full px-4 py-8 md:px-10 md:py-10">
            <div className="mb-7 flex items-end justify-between gap-4 md:mb-8">
              <div>
                <p className="font-power mb-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1 text-[11px] text-muted-foreground">
                  <Sparkles className="size-3.5 text-accent" />
                  Curated Collections
                </p>
                <h2 className="font-luxury text-2xl font-semibold md:text-3xl">Shop by Category</h2>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  Handpicked categories for a faster mobile buying journey.
                </p>
              </div>
              <Link
                href="/shop"
                className="font-modern hidden rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent md:inline-flex"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category, index) => {
                const Icon = iconMap[category.slug] || iconMap[category.id] || Smartphone
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                  >
                    <Link
                      href={`/shop?category=${category.id}`}
                      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-background/85 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_26px_rgba(15,23,42,0.1)]"
                    >
                      <div className="pointer-events-none absolute -right-7 -top-7 size-16 rounded-full bg-accent/10 blur-xl transition-opacity group-hover:opacity-100" />
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-secondary/70 text-foreground transition-colors group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent">
                          <Icon className="size-5" />
                        </div>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </div>
                      <h3 className="font-modern text-sm font-semibold leading-tight">{category.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{counts[category.id] || 0} products</p>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-5 md:hidden">
              <Link
                href="/shop"
                className="font-modern inline-flex rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                View all categories
              </Link>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </div>
    </section>
  )
}
