"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload"
import { useCategories } from "@/lib/hooks/use-categories"
import { createCategory, deleteCategory, updateCategory } from "@/lib/services/categories"
import type { Category } from "@/lib/types/entities"

type CategoryForm = {
  name: string
  slug: string
  image: string
  sortOrder: string
  active: boolean
}

const emptyForm: CategoryForm = { name: "", slug: "", image: "", sortOrder: "0", active: true }

function toForm(category: Category): CategoryForm {
  return { name: category.name, slug: category.slug, image: category.image, sortOrder: String(category.sortOrder), active: category.active }
}

export default function AdminCategoriesPage() {
  const { data, loading, error, refresh } = useCategories()
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    const payload = { name: form.name.trim(), slug: form.slug.trim(), image: form.image.trim(), sortOrder: Number(form.sortOrder) || 0, active: form.active }
    if (editingId) await updateCategory(editingId, payload)
    else await createCategory(payload)
    setForm(emptyForm)
    setEditingId(null)
    await refresh()
    setSaving(false)
  }

  const handleEdit = (item: Category) => {
    setEditingId(item.id)
    setForm(toForm(item))
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return
    await deleteCategory(id)
    await refresh()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Categories</h1>
        <p className="mt-1 text-muted-foreground">Manage category taxonomy for storefront filtering.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Input placeholder="Name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
          <Input placeholder="Slug" value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
          <Input placeholder="Image URL" value={form.image} onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))} />
          <Input placeholder="Sort Order" type="number" value={form.sortOrder} onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <CloudinaryUpload buttonText="Upload Category Image" onUploaded={(urls) => setForm((prev) => ({ ...prev, image: urls[0] ?? prev.image }))} />
          {form.image ? <div className="relative h-12 w-12 overflow-hidden rounded-md border border-border"><Image src={form.image} alt="Category" fill className="object-cover" /></div> : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />Active</label>
          <div className="flex gap-2">
            {editingId ? <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</Button> : null}
            <Button type="submit" className="gap-2" disabled={saving}><Plus className="size-4" />{saving ? "Saving..." : editingId ? "Update Category" : "Add Category"}</Button>
          </div>
        </div>
      </form>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[560px]">
          <thead><tr className="bg-secondary/40 text-left text-sm text-muted-foreground"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Sort</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-border"><td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td><td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td><td className="px-4 py-4"><Skeleton className="h-4 w-10" /></td><td className="px-4 py-4"><Skeleton className="h-5 w-16" /></td><td className="px-4 py-4"><div className="flex justify-end"><Skeleton className="h-8 w-24" /></div></td></tr>
            )) : null}
            {!loading && data.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No categories yet.</td></tr> : null}
            {!loading ? data.map((item) => (
              <tr key={item.id} className="border-t border-border text-sm">
                <td className="px-4 py-4 font-medium">{item.name}</td><td className="px-4 py-4">{item.slug}</td><td className="px-4 py-4">{item.sortOrder}</td><td className="px-4 py-4">{item.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-4"><div className="flex justify-end gap-2"><Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(item)}><Pencil className="size-4" />Edit</Button><Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(item.id)}><Trash2 className="size-4" />Delete</Button></div></td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
