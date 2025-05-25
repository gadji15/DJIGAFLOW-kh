"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    shippingMethod: "standard",
    paymentMethod: "card",
    saveInfo: true,
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pré-remplir les informations si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      // Simuler la récupération des informations utilisateur
      setFormData((prev) => ({
        ...prev,
        firstName: user.user_metadata?.first_name || "",
        lastName: user.user_metadata?.last_name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  // Mettre à jour le récapitulatif
  useEffect(() => {
    const subtotalElement = document.getElementById("checkout-subtotal")
    const totalElement = document.getElementById("checkout-total")
    const cartSummaryElement = document.getElementById("cart-summary")

    if (subtotalElement) {
      subtotalElement.textContent = formatPrice(subtotal)
    }

    if (totalElement) {
      const shipping = formData.shippingMethod === "express" ? 9.9 : 5.9
      totalElement.textContent = formatPrice(subtotal + shipping)
    }

    if (cartSummaryElement) {
      cartSummaryElement.innerHTML = `
        <div class="space-y-4 max-h-[300px] overflow-y-auto">
          ${items
            .map(
              (item) => `
            <div class="flex gap-3">
              <div class="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src="${item.image || "/placeholder.svg?height=64&width=64"}"
                  alt="${item.name}"
                  class="object-cover w-full h-full"
                />
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <h3 class="font-medium">${item.name}</h3>
                  <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
                <div class="text-sm text-muted-foreground">
                  Quantité: ${item.quantity}
                </div>
                ${
                  item.variant
                    ? `
                  <div class="text-sm text-muted-foreground">
                    ${Object.entries(item.variant)
                      .filter(([key]) => key !== "id")
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
    }
  }, [items, subtotal, formData.shippingMethod])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des articles avant de passer commande.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simuler un traitement de commande
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simuler une commande réussie
    toast({
      title: "Commande confirmée !",
      description: "Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.",
    })

    // Vider le panier
    clearCart()

    // Rediriger vers une page de confirmation
    router.push("/commande-confirmee")

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveInfo"
                checked={formData.saveInfo}
                onCheckedChange={(checked) => handleCheckboxChange("saveInfo", checked as boolean)}
              />
              <label
                htmlFor="saveInfo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sauvegarder ces informations pour la prochaine fois
              </label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Méthode de livraison</h2>
          <RadioGroup
            value={formData.shippingMethod}
            onValueChange={(value) => handleRadioChange("shippingMethod", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex-1 cursor-pointer">
                <div className="font-semibold">Livraison standard</div>
                <div className="text-sm text-muted-foreground">3-5 jours ouvrés</div>
              </Label>
              <div className="font-semibold">5,90 €</div>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express" className="flex-1 cursor-pointer">
                <div className="font-semibold">Livraison express</div>
                <div className="text-sm text-muted-foreground">1-2 jours ouvrés</div>
              </Label>
              <div className="font-semibold">9,90 €</div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Méthode de paiement</h2>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => handleRadioChange("paymentMethod", value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="font-semibold">Carte bancaire</div>
                <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
              </Label>
              <div className="flex gap-1">
                <Image src="/placeholder.svg?height=24&width=36" alt="Visa" width={36} height={24} />
                <Image src="/placeholder.svg?height=24&width=36" alt="Mastercard" width={36} height={24} />
                <Image src="/placeholder.svg?height=24&width=36" alt="Amex" width={36} height={24} />
              </div>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                <div className="font-semibold">PayPal</div>
                <div className="text-sm text-muted-foreground">Paiement sécurisé via PayPal</div>
              </Label>
              <Image src="/placeholder.svg?height=24&width=80" alt="PayPal" width={80} height={24} />
            </div>
          </RadioGroup>

          {formData.paymentMethod === "card" && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required={formData.paymentMethod === "card"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input id="expiryDate" placeholder="MM/AA" required={formData.paymentMethod === "card"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required={formData.paymentMethod === "card"} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Notes de commande</h2>
          <div className="space-y-2">
            <Label htmlFor="notes">Instructions spéciales (optionnel)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Instructions de livraison, informations complémentaires..."
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
      </Button>
    </form>
  )
}
