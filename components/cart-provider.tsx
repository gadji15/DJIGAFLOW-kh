"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: Record<string, any>
  maxStock?: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string, variant?: Record<string, any>) => void
  updateQuantity: (id: string, quantity: number, variant?: Record<string, any>) => void
  clearCart: () => void
  isInCart: (id: string, variant?: Record<string, any>) => boolean
  getItemQuantity: (id: string, variant?: Record<string, any>) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "djigaflow-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  const getItemKey = (id: string, variant?: Record<string, any>) => {
    return variant ? `${id}-${JSON.stringify(variant)}` : id
  }

  const findItemIndex = (id: string, variant?: Record<string, any>) => {
    return items.findIndex((item) => {
      const itemKey = getItemKey(item.id, item.variant)
      const searchKey = getItemKey(id, variant)
      return itemKey === searchKey
    })
  }

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((currentItems) => {
      const existingIndex = findItemIndex(newItem.id, newItem.variant)

      if (existingIndex >= 0) {
        // Item already exists, update quantity
        const updatedItems = [...currentItems]
        const existingItem = updatedItems[existingIndex]
        const newQuantity = existingItem.quantity + quantity

        // Check stock limit
        if (existingItem.maxStock && newQuantity > existingItem.maxStock) {
          toast({
            title: "Stock insuffisant",
            description: `Seulement ${existingItem.maxStock} article(s) disponible(s)`,
            variant: "destructive",
          })
          return currentItems
        }

        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        }

        toast({
          title: "Panier mis à jour",
          description: `${newItem.name} (quantité: ${newQuantity})`,
        })

        return updatedItems
      } else {
        // New item
        const cartItem: CartItem = {
          ...newItem,
          quantity,
        }

        toast({
          title: "Produit ajouté au panier",
          description: `${newItem.name} (${quantity})`,
        })

        return [...currentItems, cartItem]
      }
    })
  }

  const removeItem = (id: string, variant?: Record<string, any>) => {
    setItems((currentItems) => {
      const itemIndex = findItemIndex(id, variant)
      if (itemIndex >= 0) {
        const removedItem = currentItems[itemIndex]
        toast({
          title: "Produit retiré du panier",
          description: removedItem.name,
        })
        return currentItems.filter((_, index) => index !== itemIndex)
      }
      return currentItems
    })
  }

  const updateQuantity = (id: string, quantity: number, variant?: Record<string, any>) => {
    if (quantity <= 0) {
      removeItem(id, variant)
      return
    }

    setItems((currentItems) => {
      const itemIndex = findItemIndex(id, variant)
      if (itemIndex >= 0) {
        const updatedItems = [...currentItems]
        const item = updatedItems[itemIndex]

        // Check stock limit
        if (item.maxStock && quantity > item.maxStock) {
          toast({
            title: "Stock insuffisant",
            description: `Seulement ${item.maxStock} article(s) disponible(s)`,
            variant: "destructive",
          })
          return currentItems
        }

        updatedItems[itemIndex] = {
          ...item,
          quantity,
        }
        return updatedItems
      }
      return currentItems
    })
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Panier vidé",
      description: "Tous les articles ont été retirés du panier",
    })
  }

  const isInCart = (id: string, variant?: Record<string, any>) => {
    return findItemIndex(id, variant) >= 0
  }

  const getItemQuantity = (id: string, variant?: Record<string, any>) => {
    const itemIndex = findItemIndex(id, variant)
    return itemIndex >= 0 ? items[itemIndex].quantity : 0
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
