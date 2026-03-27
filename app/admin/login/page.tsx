import { Suspense } from "react"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm md:p-8">
        Loading login...
      </div>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  )
}
