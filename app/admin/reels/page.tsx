"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReels } from "@/lib/hooks/use-reels"
import { createReel, deleteReel, updateReel } from "@/lib/services/reels"
import type { Reel } from "@/lib/types/entities"

type ReelForm = {
  title: string
  reelUrl: string
  thumbnail: string
  caption: string
  sortOrder: string
  active: boolean
  featured: boolean
}

const emptyForm: ReelForm = {
  title: "",
  reelUrl: "",
  thumbnail: "",
  caption: "",
  sortOrder: "0",
  active: true,
  featured: false,
}

function toForm(reel: Reel): ReelForm {
  return {
    title: reel.title,
    reelUrl: reel.reelUrl,
    thumbnail: reel.thumbnail,
    caption: reel.caption,
    sortOrder: String(reel.sortOrder),
    active: reel.active,
    featured: reel.featured,
  }
}

export default function AdminReelsPage() {
  const { data, loading, refresh } = useReels()
  const [form, setForm] = useState<ReelForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      reelUrl: form.reelUrl.trim(),
      thumbnail: form.thumbnail.trim(),
      caption: form.caption.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      active: form.active,
      featured: form.featured,
    }

    if (editingId) {
      await updateReel(editingId, payload)
    } else {
      await createReel(payload)
    }

    setForm(emptyForm)
    setEditingId(null)
    await refresh()
    setSaving(false)
  }

  const handleEdit = (item: Reel) => {
    setEditingId(item.id)
    setForm(toForm(item))
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this reel?")) return
    await deleteReel(id)
    await refresh()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Reels</h1>
        <p className="mt-1 text-muted-foreground">Manage Instagram/social proof reel entries.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
          <Input placeholder="Reel URL" value={form.reelUrl} onChange={(event) => setForm((prev) => ({ ...prev, reelUrl: event.target.value }))} required />
          <Input placeholder="Thumbnail URL" value={form.thumbnail} onChange={(event) => setForm((prev) => ({ ...prev, thumbnail: event.target.value }))} required />
          <Input placeholder="Sort Order" type="number" value={form.sortOrder} onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))} />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Caption</label>
          <textarea
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.caption}
            onChange={(event) => setForm((prev) => ({ ...prev, caption: event.target.value }))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
              Featured
            </label>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <Button type="button" variant="outline" onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" className="gap-2" disabled={saving}>
              <Plus className="size-4" />
              {saving ? "Saving..." : editingId ? "Update Reel" : "Add Reel"}
            </Button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-secondary/40 text-left text-sm text-muted-foreground">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Reel URL</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No reels yet.
                </td>
              </tr>
            ) : null}
            {data.map((item) => (
              <tr key={item.id} className="border-t border-border text-sm">
                <td className="px-4 py-4 font-medium">{item.title}</td>
                <td className="px-4 py-4">
                  <a href={item.reelUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Open link
                  </a>
                </td>
                <td className="px-4 py-4">{item.active ? "Active" : "Inactive"} / {item.featured ? "Featured" : "Normal"}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(item)}>
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
