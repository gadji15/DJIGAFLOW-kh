"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingCart } from "lucide-react"
import { useEffect } from "react"

export default function CartItems() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()

  // Mettre à jour le récapitulatif
  useEffect(() => {
    const subtotalElement = document.getElementById("subtotal")
    const totalElement = document.getElementById("total")

    if (subtotalElement) {
      subtotalElement.textContent = formatPrice(subtotal)
    }

    if (totalElement) {
      totalElement.textContent = formatPrice(subtotal)
    }
  }, [subtotal])

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-6">Vous n'avez pas encore ajouté d'articles à votre panier.</p>
        <Button asChild>
          <Link href="/catalogue">Découvrir nos produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 font-semibold">Produit</div>
          <div className="col-span-2 font-semibold text-center">Prix</div>
          <div className="col-span-2 font-semibold text-center">Quantité</div>
          <div className="col-span-2 font-semibold text-right">Total</div>
        </div>
      </div>

      <div className="divide-y">
        {items.map((item) => (
          <div key={`${item.id}-${item.variant?.id || "default"}`} className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => removeItem(item.id, item.variant?.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="relative h-16 w-16 rounded overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      <Link href={`/produit/${item.id}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {Object.entries(item.variant)
                          .filter(([key]) => key !== "id")
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-center">{formatPrice(item.price)}</div>

              <div className="col-span-2">
                <div className="flex items-center justify-center border rounded-md max-w-[120px] mx-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="col-span-2 text-right font-semibold">{formatPrice(item.price * item.quantity)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted flex justify-between">
        <Button variant="outline" onClick={clearCart}>
          Vider le panier
        </Button>

        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Sous-total</div>
          <div className="font-semibold">{formatPrice(subtotal)}</div>
        </div>
      </div>
    </div>
  )
}
