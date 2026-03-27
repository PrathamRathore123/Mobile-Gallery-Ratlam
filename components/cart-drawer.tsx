"use client"

import Image from "next/image"
import { X, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/lib/helpers/whatsapp"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const whatsappNumber = useWhatsAppNumber()

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppOrderMessage({
      items: items.map((item) => ({
        title: `${item.name}${item.color ? ` (${item.color})` : ""}${item.storage ? ` ${item.storage}` : ""}`,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      total: totalPrice,
    })

    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank")
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold">Your Cart ({items.length})</h2>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-secondary">
                <MessageCircle className="size-8 text-muted-foreground" />
              </div>
              <p className="mb-2 text-muted-foreground">Your cart is empty</p>
              <Button variant="outline" className="rounded-2xl" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-secondary/50 p-3">
                  <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{item.name}</h3>
                    {item.color ? <p className="text-xs text-muted-foreground">{item.color}</p> : null}
                    <p className="mt-1 font-bold">${item.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="size-7 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto size-7 rounded-full text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-4 border-t border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="grid gap-2">
              <Button className="h-12 w-full gap-2 rounded-2xl bg-[#25D366] text-white hover:bg-[#128C7E]" onClick={handleWhatsAppOrder}>
                <MessageCircle className="size-5" />
                Order on WhatsApp
              </Button>
              <Button variant="outline" className="h-12 w-full rounded-2xl" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
