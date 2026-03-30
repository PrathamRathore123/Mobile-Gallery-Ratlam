"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types/entities"

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  brands: string[]
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedBrands: string[]
  setSelectedBrands: (brands: string[]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  maxPrice: number
  onClear: () => void
  activeFiltersCount: number
}

export function FilterSheet({
  open,
  onOpenChange,
  categories,
  brands,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  maxPrice,
  onClear,
  activeFiltersCount,
}: FilterSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed left-0 right-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out md:hidden max-h-[85vh] flex flex-col",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Filters</h2>
            {activeFiltersCount > 0 && (
              <span className="size-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    if (selectedCategories.includes(category.id)) {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category.id)
                      )
                    } else {
                      setSelectedCategories([...selectedCategories, category.id])
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm font-medium transition-colors",
                    selectedCategories.includes(category.id)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    if (selectedBrands.includes(brand)) {
                      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                    } else {
                      setSelectedBrands([...selectedBrands, brand])
                    }
                  }}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm font-medium transition-colors",
                    selectedBrands.includes(brand)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Price Range</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={Math.min(priceRange[1], maxPrice)}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-full accent-accent"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">${priceRange[0]}</span>
                <span className="text-sm font-medium">${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3 flex-shrink-0 safe-area-inset-bottom">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl"
            onClick={onClear}
          >
            Clear All
          </Button>
          <Button
            className="flex-1 h-12 rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            Show Results
          </Button>
        </div>
      </div>
    </>
  )
}
