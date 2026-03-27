"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { MessageCircle, Instagram, Mail, MapPin } from "lucide-react"
import { useAppSettings } from "@/lib/hooks/use-app-settings"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export default function ContactPage() {
  const { data: settings } = useAppSettings()
  const whatsappNumber = useWhatsAppNumber()

  const businessName = settings.businessName || siteConfig.name
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const instagramUrl = settings.instagramUrl || siteConfig.instagramUrl

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <section className="section-space">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-accent">Contact</p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">{businessName}</h1>
              <p className="mt-3 text-muted-foreground">
                Need product advice, pricing help, or quick order support? Reach us directly and continue the order flow on WhatsApp.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="size-4" />
                  WhatsApp
                </div>
                <p className="mt-2 text-lg font-semibold">+{whatsappNumber}</p>
                <Button asChild className="mt-4 rounded-xl bg-[#25D366] hover:bg-[#1fb95a]">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 size-4 text-muted-foreground" />
                    <span>{siteConfig.supportEmail}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                    <span>{siteConfig.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Instagram className="mt-0.5 size-4 text-muted-foreground" />
                    <Link href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-accent">
                      {instagramUrl.replace("https://", "")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
