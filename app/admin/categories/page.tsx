import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for categories
const categories = [
  {
    id: 1,
    name: "Électronique",
    slug: "electronique",
    description: "Smartphones, ordinateurs, accessoires",
    products_count: 156,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    parent_id: null,
    created_at: "2024-01-15",
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Téléphones mobiles et accessoires",
    products_count: 89,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    parent_id: 1,
    created_at: "2024-01-16",
  },
  {
    id: 3,
    name: "Mode",
    slug: "mode",
    description: "Vêtements, chaussures, accessoires",
    products_count: 234,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    parent_id: null,
    created_at: "2024-01-17",
  },
  {
    id: 4,
    name: "Maison & Jardin",
    slug: "maison-jardin",
    description: "Décoration, mobilier, jardinage",
    products_count: 78,
    status: "inactive",
    image: "/placeholder.svg?height=60&width=60",
    parent_id: null,
    created_at: "2024-01-18",
  },
]

function CategoriesContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Catégories</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez les catégories de produits</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/categories/ajouter">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher une catégorie..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <select className="border rounded px-3 py-2 bg-background min-w-[120px]">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <Package className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  </div>
                </div>
                <Badge variant={category.status === "active" ? "default" : "secondary"}>
                  {category.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span className="font-medium">{category.products_count}</span>
                  <span className="text-muted-foreground"> produits</span>
                </div>
                {category.parent_id && (
                  <Badge variant="outline" className="text-xs">
                    Sous-catégorie
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/admin/categories/${category.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/admin/categories/${category.id}/modifier`}>
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total catégories</p>
                <h3 className="text-2xl font-bold">{categories.length}</h3>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Catégories actives</p>
                <h3 className="text-2xl font-bold">{categories.filter((c) => c.status === "active").length}</h3>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits total</p>
                <h3 className="text-2xl font-bold">{categories.reduce((sum, c) => sum + c.products_count, 0)}</h3>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sous-catégories</p>
                <h3 className="text-2xl font-bold">{categories.filter((c) => c.parent_id !== null).length}</h3>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CategoriesContent />
    </Suspense>
  )
}
