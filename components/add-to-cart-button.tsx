"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "./cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "@/components/ui/notification"

interface AddToCartButtonProps {
  product: {
    id: string | number
    name: string
    price: number
    salePrice?: number | null
    images?: string[]
  }
  variant?: {
    id: string | number
    name: string
    [key: string]: any
  }
  quantity?: number
  className?: string
}

export function AddToCartButton({ product, variant, quantity = 1, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const { showNotification } = useNotification()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images?.[0] || "/placeholder.svg?height=100&width=100",
      quantity,
      variant,
    })

    // Animation d'ajout au panier
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)

    // Notification
    showNotification({
      type: "success",
      title: "Produit ajouté",
      message: `${product.name} a été ajouté à votre panier.`,
      duration: 3000,
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full relative overflow-hidden group ${className}`}
      disabled={isAdded}
    >
      <AnimatePresence mode="wait">
        {isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center"
          >
            <Check className="mr-2 h-4 w-4" />
            Ajouté
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-center"
          >
            <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Ajouter au panier
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
