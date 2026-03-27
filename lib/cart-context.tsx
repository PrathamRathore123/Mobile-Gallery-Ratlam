"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { removeLocalStorage, writeLocalStorage } from "@/lib/helpers/local-storage"

const CART_STORAGE_KEY = "mobile-gallery-cart"

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  color?: string
  storage?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getInitialItems(): CartItem[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY)
    return value ? (JSON.parse(value) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialItems)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      removeLocalStorage(CART_STORAGE_KEY)
      return
    }

    writeLocalStorage(CART_STORAGE_KEY, items)
  }, [items])

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prev.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...prev, { ...newItem, quantity: 1 }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      return
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
