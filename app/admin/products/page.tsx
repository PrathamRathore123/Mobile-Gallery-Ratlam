"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Plus, Search, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { createProduct, deleteProduct, updateProduct } from "@/lib/services/products"
import type { Product, ProductInput, StockStatus } from "@/lib/types/entities"

type ProductFormState = {
  title: string
  slug: string
  brand: string
  shortDescription: string
  fullDescription: string
  categoryId: string
  price: string
  salePrice: string
  images: string
  highlights: string
  specifications: string
  colors: string
  storageOptions: string
  rating: string
  reviewCount: string
  featured: boolean
  active: boolean
  stockStatus: StockStatus
}

const emptyForm: ProductFormState = {
  title: "",
  slug: "",
  brand: "",
  shortDescription: "",
  fullDescription: "",
  categoryId: "",
  price: "",
  salePrice: "",
  images: "",
  highlights: "",
  specifications: "",
  colors: "",
  storageOptions: "",
  rating: "4.8",
  reviewCount: "0",
  featured: false,
  active: true,
  stockStatus: "in_stock",
}

function toFormState(product: Product): ProductFormState {
  return {
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    categoryId: product.categoryId,
    price: String(product.price),
    salePrice: product.salePrice ? String(product.salePrice) : "",
    images: product.images.join("\n"),
    highlights: product.highlights.join("\n"),
    specifications: product.specifications.map((item) => `${item.label}: ${item.value}`).join("\n"),
    colors: product.colors.join(", "),
    storageOptions: product.storageOptions.join(", "),
    rating: String(product.rating),
    reviewCount: String(product.reviewCount),
    featured: product.featured,
    active: product.active,
    stockStatus: product.stockStatus,
  }
}

function formToInput(form: ProductFormState): ProductInput {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    brand: form.brand.trim(),
    shortDescription: form.shortDescription.trim(),
    fullDescription: form.fullDescription.trim(),
    categoryId: form.categoryId,
    price: Number(form.price) || 0,
    salePrice: form.salePrice.trim() ? Number(form.salePrice) : null,
    images: form.images
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    highlights: form.highlights
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    specifications: form.specifications
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":")
        return {
          label: label.trim(),
          value: rest.join(":").trim(),
        }
      })
      .filter((item) => item.label && item.value),
    colors: form.colors
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    storageOptions: form.storageOptions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    rating: Number(form.rating) || 4.8,
    reviewCount: Number(form.reviewCount) || 0,
    featured: form.featured,
    active: form.active,
    stockStatus: form.stockStatus,
  }
}

export default function AdminProductsPage() {
  const { data: products, loading, refresh } = useProducts()
  const { data: categories } = useCategories()

  const [searchQuery, setSearchQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<ProductFormState>(emptyForm)

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) => {
      return product.title.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query)
    })
  }, [products, searchQuery])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm(toFormState(product))
    setFormOpen(true)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSaving(true)
      const payload = formToInput(form)

      if (editing) {
        await updateProduct(editing.id, payload)
      } else {
        await createProduct(payload)
      }

      await refresh()
      setFormOpen(false)
      setEditing(null)
      setForm(emptyForm)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product?")
    if (!confirmed) return

    await deleteProduct(id)
    await refresh()
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Products</h1>
          <p className="mt-1 text-muted-foreground">Create, edit, and publish product listings.</p>
        </div>
        <Button className="gap-2 rounded-2xl" onClick={openCreate}>
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-12 rounded-2xl pl-10"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="bg-secondary/40 text-left text-sm text-muted-foreground">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
            {filteredProducts.map((product) => {
              const category = categories.find((item) => item.id === product.categoryId)
              const image = product.images[0]
              const finalPrice = product.salePrice ?? product.price

              return (
                <tr key={product.id} className="border-t border-border text-sm">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-xl bg-secondary">
                        {image ? (
                          <Image src={image} alt={product.title} fill className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-xs text-muted-foreground">{product.brand || "Brand not set"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{category?.name ?? "Uncategorized"}</td>
                  <td className="px-4 py-4">
                    ${finalPrice.toLocaleString()}
                    {product.salePrice ? (
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        ${product.price.toLocaleString()}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"}`}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(product)}>
                        <Pencil className="size-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-background">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <h2 className="text-xl font-bold">{editing ? "Edit Product" : "Add Product"}</h2>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setFormOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Title</label>
                  <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Slug</label>
                  <Input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Brand</label>
                  <Input value={form.brand} onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Category</label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.categoryId}
                    onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Price</label>
                  <Input type="number" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Sale Price (optional)</label>
                  <Input type="number" value={form.salePrice} onChange={(event) => setForm((prev) => ({ ...prev, salePrice: event.target.value }))} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Short Description</label>
                <Input value={form.shortDescription} onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))} required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Full Description</label>
                <textarea
                  className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.fullDescription}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullDescription: event.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Image URLs (one per line)</label>
                  <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.images} onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Highlights (one per line)</label>
                  <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.highlights} onChange={(event) => setForm((prev) => ({ ...prev, highlights: event.target.value }))} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Specifications (format: Label: Value)</label>
                <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.specifications} onChange={(event) => setForm((prev) => ({ ...prev, specifications: event.target.value }))} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Colors (comma separated)</label>
                  <Input value={form.colors} onChange={(event) => setForm((prev) => ({ ...prev, colors: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Storage Options (comma separated)</label>
                  <Input value={form.storageOptions} onChange={(event) => setForm((prev) => ({ ...prev, storageOptions: event.target.value }))} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Rating</label>
                  <Input type="number" step="0.1" value={form.rating} onChange={(event) => setForm((prev) => ({ ...prev, rating: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Review Count</label>
                  <Input type="number" value={form.reviewCount} onChange={(event) => setForm((prev) => ({ ...prev, reviewCount: event.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Stock Status</label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.stockStatus}
                    onChange={(event) => setForm((prev) => ({ ...prev, stockStatus: event.target.value as StockStatus }))}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Preorder</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
