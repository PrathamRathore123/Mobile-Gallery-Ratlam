"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Video,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAdminGuard } from "@/lib/hooks/use-admin-guard"
import { logoutAdmin } from "@/lib/auth/admin-auth"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: FolderTree, label: "Categories" },
  { href: "/admin/reels", icon: Video, label: "Reels" },
  { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === "/admin/login"
  const { loading, admin, isAuthorized } = useAdminGuard()

  const handleLogout = async () => {
    await logoutAdmin()
    router.replace("/admin/login")
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-6">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-sm text-muted-foreground">
          Verifying admin access...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary">
              <span className="text-sm font-bold text-primary-foreground">MG</span>
            </div>
            <span className="font-bold">Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="size-5" />
            <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary">
                <span className="font-bold text-sidebar-primary-foreground">MG</span>
              </div>
              <div>
                <p className="text-sm font-bold">Mobile Gallery</p>
                <p className="text-xs text-sidebar-foreground/60">{admin?.email}</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-2 border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              Logout
            </Button>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-5" />
              Back to Store
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">{children}</div>
    </div>
  )
}
