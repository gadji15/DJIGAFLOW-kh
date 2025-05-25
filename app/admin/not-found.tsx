"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Settings, Users, Package, ArrowLeft } from "lucide-react"
import AdminSidebar from "./admin-sidebar"

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary/20 mb-4">404</h1>
            <h2 className="text-2xl font-bold mb-4">Page d'administration non trouvée</h2>
            <p className="text-muted-foreground mb-8">La page d'administration que vous recherchez n'existe pas.</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Pages d'administration disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild className="h-auto p-4 flex-col gap-2">
                  <Link href="/admin">
                    <Home className="h-6 w-6" />
                    <span>Tableau de bord</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/admin/produits">
                    <Package className="h-6 w-6" />
                    <span>Gestion des produits</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/admin/commandes">
                    <Settings className="h-6 w-6" />
                    <span>Gestion des commandes</span>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Link href="/admin/utilisateurs">
                    <Users className="h-6 w-6" />
                    <span>Gestion des utilisateurs</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  )
}
