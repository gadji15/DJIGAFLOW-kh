import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import CheckoutForm from "./checkout-form"

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center mb-6">
            <Button asChild variant="ghost" size="sm" className="mr-2">
              <Link href="/panier">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au panier
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Paiement</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif de commande</h2>

                <div id="cart-summary">
                  {/* Injecté dynamiquement par le JavaScript client */}
                  <div className="text-center text-muted-foreground">Chargement du récapitulatif...</div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span id="checkout-subtotal">0,00 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span id="checkout-shipping">5,90 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span id="checkout-taxes">0,00 €</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span id="checkout-total">0,00 €</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Code promo</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Entrez votre code" className="flex-1" />
                    <Button variant="outline">Appliquer</Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>Paiement sécurisé. Vos informations sont protégées.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>Livraison gratuite à partir de 50€ d'achat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
