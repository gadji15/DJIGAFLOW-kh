"use client"

import { useContext } from "react"
import { ToastContext } from "@/components/ui/toast-system"

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Specialized hooks for different scenarios
export function useFormToast() {
  const { success, error, warning } = useToast()

  return {
    onSuccess: (message = "Formulaire soumis avec succès") => success(message),
    onError: (message = "Erreur lors de la soumission") => error(message),
    onValidationError: (message = "Veuillez corriger les erreurs") => warning(message),
  }
}

export function useAuthToast() {
  const { success, error, info } = useToast()

  return {
    onLogin: () => success("Connexion réussie", "Bienvenue !"),
    onLogout: () => info("Vous avez été déconnecté"),
    onRegister: () => success("Compte créé avec succès", "Bienvenue !"),
    onError: (message: string) => error(message, "Erreur d'authentification"),
  }
}

export function useCartToast() {
  const { success, info, warning } = useToast()

  return {
    onAdd: (productName: string) => success(`${productName} ajouté au panier`),
    onRemove: (productName: string) => info(`${productName} retiré du panier`),
    onUpdate: () => info("Panier mis à jour"),
    onClear: () => warning("Panier vidé"),
  }
}

export function useOrderToast() {
  const { success, info, loading } = useToast()

  return {
    onProcessing: () => loading("Traitement de votre commande..."),
    onSuccess: (orderNumber: string) => success(`Commande ${orderNumber} confirmée`, "Merci pour votre achat !"),
    onShipped: (trackingNumber: string) => info(`Commande expédiée - Suivi: ${trackingNumber}`),
  }
}
