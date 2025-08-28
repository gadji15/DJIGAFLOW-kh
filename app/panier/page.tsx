import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import CartItems from "./cart-items"

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItems />
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span id="subtotal">0,00 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span id="shipping">Calculé à l'étape suivante</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span id="taxes">Calculé à l'étape suivante</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span id="total">0,00 €</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/paiement">
                      Passer au paiement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/catalogue">Continuer vos achats</Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Code promo</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Entrez votre code" className="flex-1" />
                    <Button variant="outline">Appliquer</Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Livraison gratuite à partir de 50€ d'achat</p>
                  <p>Paiement sécurisé</p>
                  <p>30 jours pour changer d'avis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
