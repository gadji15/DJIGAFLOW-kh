import type { Metadata } from "next"
import { EnhancedCheckoutForm } from "@/components/forms/enhanced-checkout-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Paiement | DjigaFlow",
  description: "Finalisez votre commande en toute sécurité avec notre système de paiement sécurisé.",
  keywords: ["paiement", "checkout", "commande", "sécurisé"],
}

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Chargement du formulaire de paiement...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Finaliser votre commande</h1>
          <p className="text-muted-foreground">
            Complétez vos informations pour finaliser votre achat en toute sécurité
          </p>
        </div>

        <Suspense fallback={<CheckoutSkeleton />}>
          <EnhancedCheckoutForm />
        </Suspense>
      </div>
    </div>
  )
}
