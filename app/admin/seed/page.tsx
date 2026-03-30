"use client"

import { useState } from "react"
import { Database, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { seedInitialData } from "@/lib/services/seed"

export default function AdminSeedPage() {
  const [seeding, setSeeding] = useState(false)
  const [force, setForce] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    try {
      setError(null)
      setResult(null)
      setSeeding(true)

      const response = await seedInitialData({ force })
      setResult(
        `Seed complete: categories ${response.categoriesSeeded}, products ${response.productsSeeded}, reels ${response.reelsSeeded}, reviews ${response.reviewsSeeded}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seeding failed")
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="max-w-3xl p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Seed Utility</h1>
        <p className="mt-1 text-muted-foreground">Bootstrap initial categories, products, reels, and reviews for the store.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Database className="size-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">Initial Data Seeder</p>
            <p className="text-sm text-muted-foreground">Uses predefined seed data from `lib/constants/seed-data.ts`.</p>
          </div>
        </div>

        <label className="mb-4 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={force} onChange={(event) => setForce(event.target.checked)} />
          Force overwrite existing data
        </label>

        <Button onClick={handleSeed} disabled={seeding} className="gap-2 rounded-xl">
          <RefreshCcw className={`size-4 ${seeding ? "animate-spin" : ""}`} />
          {seeding ? "Seeding..." : "Run Seed"}
        </Button>

        {result ? <p className="mt-4 text-sm text-green-600">{result}</p> : null}
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}
