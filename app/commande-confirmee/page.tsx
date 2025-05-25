import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck, Clock } from "lucide-react"

export default function OrderConfirmationPage() {
  // Générer un numéro de commande aléatoire
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
            <p className="text-muted-foreground">
              Merci pour votre commande. Nous vous avons envoyé un email de confirmation.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div>
                <h2 className="font-semibold mb-1">Numéro de commande</h2>
                <p className="text-muted-foreground">{orderNumber}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <h2 className="font-semibold mb-1">Date de commande</h2>
                <p className="text-muted-foreground">{new Date().toLocaleDateString("fr-FR")}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="font-semibold mb-4">Statut de la commande</h2>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Confirmée</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Package className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Préparée</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Expédiée</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-xs mt-1">Livrée</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10">
                    <div className="h-full bg-primary" style={{ width: "12.5%" }}></div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="font-semibold mb-4">Détails de livraison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Adresse de livraison</h3>
                    <p className="text-sm text-muted-foreground">
                      Jean Dupont
                      <br />
                      123 Rue de Paris
                      <br />
                      75001 Paris
                      <br />
                      France
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Méthode de livraison</h3>
                    <p className="text-sm text-muted-foreground">
                      Livraison standard
                      <br />
                      Délai estimé: 3-5 jours ouvrés
                    </p>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        Livraison prévue entre le{" "}
                        {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")} et le{" "}
                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="font-semibold mb-4">Récapitulatif de la commande</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>89,90 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span>5,90 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>19,16 €</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>95,80 €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/compte/commandes">Suivre ma commande</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/catalogue">Continuer mes achats</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
