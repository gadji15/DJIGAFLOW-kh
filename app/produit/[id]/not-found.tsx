"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Search, ArrowLeft, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Package className="h-24 w-24 text-primary/20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Que souhaitez-vous faire ?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild className="h-auto p-4 flex-col gap-2">
                  <Link href="/catalogue">
                    <ShoppingBag className="h-6 w-6" />
                    <span>Voir tous les produits</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/nouveautes">
                    <Search className="h-6 w-6" />
                    <span>Découvrir les nouveautés</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/promotions">
                    <Package className="h-6 w-6" />
                    <span>Voir les promotions</span>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col gap-2" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-6 w-6" />
                  <span>Page précédente</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
