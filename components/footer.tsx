"use client"

import Link from "next/link"
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react"
import { primaryNav, siteConfig } from "@/lib/site-config"
import { useAppSettings } from "@/lib/hooks/use-app-settings"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export function Footer() {
  const { data: settings } = useAppSettings()
  const whatsappNumber = useWhatsAppNumber()

  const businessName = settings.businessName || siteConfig.name
  const whatsappUrl = `https://wa.me/${whatsappNumber}`
  const instagramUrl = settings.instagramUrl || siteConfig.instagramUrl

  return (
    <footer className="mt-12 border-t border-border bg-secondary/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
                <span className="text-sm font-bold text-primary-foreground">{siteConfig.shortName}</span>
              </div>
              <span className="font-modern text-lg font-semibold">{businessName}</span>
            </div>
            <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
            <div className="mt-4 flex gap-2">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-card p-2 hover:text-accent">
                <MessageCircle className="size-4" />
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="rounded-full bg-card p-2 hover:text-accent">
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><MessageCircle className="size-4" /> +{whatsappNumber}</li>
              <li className="flex items-center gap-2"><Mail className="size-4" /> {siteConfig.supportEmail}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4" /> {siteConfig.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
