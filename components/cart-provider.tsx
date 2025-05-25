"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: string | number
  name: string
  price: number
  image: string
  quantity: number
  variant?: {
    id: string | number
    name: string
    [key: string]: any
  }
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string | number, variantId?: string | number) => void
  updateQuantity: (id: string | number, quantity: number, variantId?: string | number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (e) {
        console.error("Erreur lors du chargement du panier:", e)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      // Vérifier si l'article existe déjà avec la même variante
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.id === newItem.id && ((!item.variant && !newItem.variant) || item.variant?.id === newItem.variant?.id),
      )

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité si l'article existe déjà
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Ajouter le nouvel article
        return [...currentItems, newItem]
      }
    })
  }

  const removeItem = (id: string | number, variantId?: string | number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === id && (!variantId || item.variant?.id === variantId))),
    )
  }

  const updateQuantity = (id: string | number, quantity: number, variantId?: string | number) => {
    if (quantity < 1) {
      removeItem(id, variantId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && (!variantId || item.variant?.id === variantId) ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
