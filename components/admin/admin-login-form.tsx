"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/lib/site-config"
import { ShieldCheck } from "lucide-react"
import { loginAdmin } from "@/lib/auth/admin-auth"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextPath = useMemo(() => searchParams.get("next") || "/admin", [searchParams])

  const canSubmit = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    try {
      setError(null)
      setIsSubmitting(true)
      await loginAdmin(email.trim(), password)
      router.replace(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your approved Firebase admin account.</p>
        </div>

        {(searchParams.get("error") === "unauthorized" || error) ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error ?? "This account does not have admin access."}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@mobilegallery.store"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login & Open Admin Panel"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Back to {siteConfig.name}
          </Link>
        </div>
      </div>
    </main>
  )
}
