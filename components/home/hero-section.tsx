"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { useAppSettings } from "@/lib/hooks/use-app-settings"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export function HeroSection() {
  const whatsappNumber = useWhatsAppNumber()
  const { data: settings } = useAppSettings()

  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <section className="section-space relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary/90" />
      <BackgroundBeams className="opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.14),transparent_38%),radial-gradient(circle_at_20%_85%,rgba(255,255,255,0.12),transparent_42%)]" />
      <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative container mx-auto px-4 py-2 md:py-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <motion.div className="space-y-6 text-center lg:text-left" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <div className="font-power inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm">
              <span className="size-2 animate-pulse rounded-full bg-accent" />
              Trusted by 50K+ shoppers
            </div>
            <h1 className="font-luxury text-balance text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              {settings.heroTitle || "Premium smartphones for "}
              <span className="font-modern text-accent">Modern Life</span>
            </h1>
            <p className="mx-auto max-w-md text-lg text-primary-foreground/80 lg:mx-0">
              {settings.heroSubtitle || "Discover flagship phones, accessories, and quick support with a frictionless WhatsApp checkout flow."}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="h-14 gap-2 rounded-2xl bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="h-14 gap-2 rounded-2xl border border-primary-foreground/20 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-5" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div className="relative flex justify-center" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative h-[400px] w-[280px] md:h-[500px] md:w-[350px]">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-accent/30 to-transparent blur-3xl" />
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/15 bg-white/[0.04]" />
              <Image src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=800&fit=crop" alt="Featured phone" fill className="object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.5)]" priority />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
