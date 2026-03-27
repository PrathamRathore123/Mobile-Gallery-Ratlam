"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Play, Phone } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shop", icon: Search, label: "Shop" },
  { href: "/reels", icon: Play, label: "Reels" },
  { href: "/cart", icon: ShoppingBag, label: "Cart", badge: true },
  { href: "/contact", icon: Phone, label: "Contact" },
]

export function MobileNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/85 backdrop-blur-xl md:hidden safe-area-inset-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-all duration-200",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
                {item.badge && totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-accent" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
