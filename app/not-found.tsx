"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react"


export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-4">Page non trouvée</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Que souhaitez-vous faire ?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild className="h-auto p-4 flex-col gap-2">
                  <Link href="/">
                    <Home className="h-6 w-6" />
                    <span>Retour à l'accueil</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/catalogue">
                    <ShoppingBag className="h-6 w-6" />
                    <span>Voir le catalogue</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/nouveautes">
                    <Search className="h-6 w-6" />
                    <span>Découvrir les nouveautés</span>
                  </Link>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex-col gap-2" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-6 w-6" />
                  <span>Page précédente</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
