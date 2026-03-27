"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { upsertSettings } from "@/lib/services/settings"
import { useAppSettings } from "@/lib/hooks/use-app-settings"

export default function AdminSettingsPage() {
  const { data, loading, refresh } = useAppSettings()
  const [saving, setSaving] = useState(false)

  const formKey = useMemo(() => {
    return `${data.updatedAt?.getTime() ?? 0}-${data.businessName}`
  }, [data.businessName, data.updatedAt])

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setSaving(true)
    await upsertSettings({
      businessName: String(formData.get("businessName") || "").trim(),
      whatsappNumber: String(formData.get("whatsappNumber") || "").trim(),
      instagramUrl: String(formData.get("instagramUrl") || "").trim(),
      heroTitle: String(formData.get("heroTitle") || "").trim(),
      heroSubtitle: String(formData.get("heroSubtitle") || "").trim(),
      supportText: String(formData.get("supportText") || "").trim(),
    })
    await refresh()
    setSaving(false)
  }

  return (
    <div className="max-w-4xl p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Update storefront business and hero content settings.</p>
      </div>

      <form key={formKey} onSubmit={handleSave} className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Business Name</label>
            <Input name="businessName" defaultValue={data.businessName} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">WhatsApp Number</label>
            <Input name="whatsappNumber" defaultValue={data.whatsappNumber} required />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Instagram URL</label>
          <Input name="instagramUrl" defaultValue={data.instagramUrl} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Hero Title</label>
          <Input name="heroTitle" defaultValue={data.heroTitle} required />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Hero Subtitle</label>
          <textarea
            name="heroSubtitle"
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={data.heroSubtitle}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Support Text</label>
          <textarea
            name="supportText"
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={data.supportText}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="rounded-2xl px-8" disabled={saving || loading}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
