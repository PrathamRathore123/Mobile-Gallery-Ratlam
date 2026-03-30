"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useReviews } from "@/lib/hooks/use-reviews"
import { createReview, deleteReview, updateReview } from "@/lib/services/reviews"
import type { Review } from "@/lib/types/entities"

type ReviewForm = {
  customerName: string
  rating: string
  comment: string
  sourceUrl: string
  productId: string
  active: boolean
  featured: boolean
}

const emptyForm: ReviewForm = { customerName: "", rating: "5", comment: "", sourceUrl: "", productId: "", active: true, featured: false }

function toForm(review: Review): ReviewForm {
  return { customerName: review.customerName, rating: String(review.rating), comment: review.comment, sourceUrl: review.sourceUrl ?? "", productId: review.productId ?? "", active: review.active, featured: review.featured }
}

export default function AdminReviewsPage() {
  const { data, loading, error, refresh } = useReviews()
  const [form, setForm] = useState<ReviewForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    const payload = { customerName: form.customerName.trim(), rating: Math.min(5, Math.max(1, Number(form.rating) || 5)), comment: form.comment.trim(), sourceUrl: form.sourceUrl.trim() || null, productId: form.productId.trim() || null, active: form.active, featured: form.featured }
    if (editingId) await updateReview(editingId, payload)
    else await createReview(payload)
    setForm(emptyForm)
    setEditingId(null)
    await refresh()
    setSaving(false)
  }

  const handleEdit = (item: Review) => { setEditingId(item.id); setForm(toForm(item)) }
  const handleDelete = async (id: string) => { if (!window.confirm("Delete this review?")) return; await deleteReview(id); await refresh() }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-2xl font-bold md:text-3xl">Reviews</h1><p className="mt-1 text-muted-foreground">Manage public customer testimonials and ratings.</p></div>

      <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Customer name" value={form.customerName} onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))} required />
          <Input placeholder="Rating (1-5)" type="number" min={1} max={5} value={form.rating} onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))} required />
          <Input placeholder="Source URL (optional)" value={form.sourceUrl} onChange={(event) => setForm((prev) => ({ ...prev, sourceUrl: event.target.value }))} />
        </div>
        <Input className="mt-4" placeholder="Product ID (optional)" value={form.productId} onChange={(event) => setForm((prev) => ({ ...prev, productId: event.target.value }))} />
        <div className="mt-4"><label className="mb-2 block text-sm font-medium">Comment</label><textarea className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.comment} onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))} required /></div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />Active</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />Featured</label>
          </div>
          <div className="flex gap-2">
            {editingId ? <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</Button> : null}
            <Button type="submit" className="gap-2" disabled={saving}><Plus className="size-4" />{saving ? "Saving..." : editingId ? "Update Review" : "Add Review"}</Button>
          </div>
        </div>
      </form>

      {error ? <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px]">
          <thead><tr className="bg-secondary/40 text-left text-sm text-muted-foreground"><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Comment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody>
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t border-border"><td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td><td className="px-4 py-4"><Skeleton className="h-4 w-12" /></td><td className="px-4 py-4"><Skeleton className="h-4 w-56" /></td><td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td><td className="px-4 py-4"><div className="flex justify-end"><Skeleton className="h-8 w-24" /></div></td></tr>
            )) : null}
            {!loading && data.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No reviews yet.</td></tr> : null}
            {!loading ? data.map((item) => (
              <tr key={item.id} className="border-t border-border text-sm">
                <td className="px-4 py-4 font-medium">{item.customerName}</td>
                <td className="px-4 py-4">{item.rating}/5</td>
                <td className="max-w-[360px] px-4 py-4 text-muted-foreground">{item.comment}</td>
                <td className="px-4 py-4">{item.active ? "Active" : "Inactive"} / {item.featured ? "Featured" : "Normal"}</td>
                <td className="px-4 py-4"><div className="flex justify-end gap-2"><Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(item)}><Pencil className="size-4" />Edit</Button><Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(item.id)}><Trash2 className="size-4" />Delete</Button></div></td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
