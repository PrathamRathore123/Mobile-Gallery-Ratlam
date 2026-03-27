"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X, MessageCircle, Shield } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { primaryNav, siteConfig } from "@/lib/site-config"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"
import { useAppSettings } from "@/lib/hooks/use-app-settings"

export function Header() {
  const { totalItems, setIsOpen } = useCart()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const whatsappNumber = useWhatsAppNumber()
  const { data: settings } = useAppSettings()

  const businessName = settings.businessName || siteConfig.name
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary shadow-sm ring-1 ring-white/10">
              <span className="text-sm font-bold text-primary-foreground">{siteConfig.shortName}</span>
            </div>
            <div className="leading-none">
              <p className="font-power text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Premium Store</p>
              <p className="font-modern text-sm font-semibold sm:text-base">{businessName}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {item.label}
                </Link>
              )
            })}
            <Button asChild variant="outline" size="sm" className="rounded-full border-border/70 px-4">
              <Link href="/admin/login">
                <Shield className="size-4" />
                Admin Login
              </Link>
            </Button>
          </nav>

          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "absolute left-0 right-0 top-full border-b border-border bg-background/95 p-4 transition-all duration-300 backdrop-blur-xl",
                searchOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              )}
            >
              <div className="container mx-auto">
                <Input placeholder="Search products..." className="h-12 w-full rounded-2xl bg-secondary/70" autoFocus={searchOpen} />
              </div>
            </div>

            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSearchOpen(!searchOpen)}>
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative rounded-full" onClick={() => setIsOpen(true)}>
              <ShoppingBag className="size-5" />
              {totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  {totalItems}
                </span>
              ) : null}
            </Button>

            <Button asChild size="sm" className="hidden rounded-full bg-[#25D366] px-4 text-white hover:bg-[#1fb95a] md:inline-flex">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                Chat
              </a>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <div className={cn("overflow-hidden transition-all duration-300 md:hidden", mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0")}>
          <div className="grid grid-cols-2 gap-2">
            {primaryNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "bg-secondary/70 hover:bg-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
          <Button asChild className="mt-3 h-11 w-full rounded-2xl bg-[#25D366] hover:bg-[#1fb95a]">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="mt-2 h-11 w-full rounded-2xl border-border/70">
            <Link href="/admin/login">
              <Shield className="size-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
