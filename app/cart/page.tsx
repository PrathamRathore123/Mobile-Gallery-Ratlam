"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react"
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/lib/helpers/whatsapp"
import { formatINR } from "@/lib/helpers/currency"
import { useWhatsAppNumber } from "@/lib/hooks/use-whatsapp-number"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="mb-8 flex items-center gap-4">
            <Link href="/shop" className="flex size-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/80">
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-2xl font-bold md:text-3xl">Shopping Cart</h1>
            {items.length > 0 ? <span className="text-muted-foreground">({items.length} items)</span> : null}
          </div>

          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-secondary">
                <ShoppingBag className="size-10 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-bold">Your cart is empty</h2>
              <p className="mb-6 text-muted-foreground">Looks like you have not added anything yet.</p>
              <Button asChild size="lg" className="rounded-2xl">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                    <div className="relative size-24 flex-shrink-0 overflow-hidden rounded-xl bg-secondary md:size-32">
                      <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-base font-semibold md:text-lg">{item.name}</h3>
                      {item.color ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.color}
                          {item.storage ? ` | ${item.storage}` : ""}
                        </p>
                      ) : null}
                      <p className="mt-2 text-lg font-bold">{formatINR(item.price)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="size-4" />
                          </Button>
                          <span className="w-8 text-center text-base font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full rounded-2xl" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <div>
                <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatINR(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold">{formatINR(totalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" className="h-14 w-full gap-2 rounded-2xl bg-[#25D366] hover:bg-[#128C7E]" onClick={handleWhatsAppOrder}>
                      <MessageCircle className="size-5" />
                      Order on WhatsApp
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-14 w-full rounded-2xl">
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>

                  <p className="mt-4 text-center text-xs text-muted-foreground">By placing an order, you agree to our terms.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
