"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { FilterSheet } from "@/components/shop/filter-sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useActiveProducts } from "@/lib/hooks/use-products"
import { useActiveCategories } from "@/lib/hooks/use-categories"

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" },
]

export default function ShopPage() {
  const { data: products } = useActiveProducts()
  const { data: categories } = useActiveCategories()

  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState("featured")

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))
  }, [products])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.categoryId))
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) => selectedBrands.includes(product.brand))
    }

    filtered = filtered.filter((product) => {
      const finalPrice = product.salePrice ?? product.price
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1]
    })

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
        break
      case "price-desc":
        filtered.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => {
          const left = a.createdAt ? a.createdAt.getTime() : 0
          const right = b.createdAt ? b.createdAt.getTime() : 0
          return right - left
        })
        break
      default:
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
    }

    return filtered
  }, [products, selectedCategories, selectedBrands, priceRange, sortBy])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 5000])
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Shop</h1>
            <p className="text-muted-foreground">Browse our collection of premium devices</p>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 rounded-2xl md:hidden" onClick={() => setFilterOpen(true)}>
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    {activeFiltersCount}
                  </span>
                ) : null}
              </Button>
              <p className="hidden text-sm text-muted-foreground md:block">{filteredProducts.length} products</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-2xl">
                  {sortOptions.find((option) => option.value === sortBy)?.label}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => setSortBy(option.value)} className="cursor-pointer">
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-8">
            <aside className="hidden w-64 flex-shrink-0 md:block">
              <div className="sticky top-20 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Filters</h2>
                  {activeFiltersCount > 0 ? (
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-accent" onClick={clearFilters}>
                      Clear all
                    </Button>
                  ) : null}
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedCategories([...selectedCategories, category.id])
                            } else {
                              setSelectedCategories(selectedCategories.filter((item) => item !== category.id))
                            }
                          }}
                          className="size-4 rounded border-border accent-accent"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((item) => item !== brand))
                            }
                          }}
                          className="size-4 rounded border-border accent-accent"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
                      className="w-full accent-accent"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="mb-4 text-muted-foreground">No products found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 4} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categories}
        brands={brands}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onClear={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  )
}
