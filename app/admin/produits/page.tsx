import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"

// Fonction pour récupérer les produits
async function getProducts(searchParams: any) {
  let query = supabaseAdmin.from("products").select("*, categories(name)")

  // Filtres
  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`)
  }

  if (searchParams.category) {
    query = query.eq("category_id", searchParams.category)
  }

  // Tri
  const sortField = searchParams.sort_by || "created_at"
  const sortOrder = searchParams.sort_order === "asc" ? "asc" : "desc"
  query = query.order(sortField, { ascending: sortOrder === "asc" })

  // Pagination
  const page = Number.parseInt(searchParams.page) || 1
  const pageSize = 10
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  query = query.range(start, end)

  const { data, error, count } = await query

  if (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return { products: [], count: 0 }
  }

  return { products: data || [], count }
}

// Fonction pour récupérer les catégories
async function getCategories() {
  const { data, error } = await supabaseAdmin.from("categories").select("*").order("name")

  if (error) {
    console.error("Erreur lors de la récupération des catégories:", error)
    return []
  }

  return data || []
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const { products, count } = await getProducts(searchParams)
  const categories = await getCategories()

  // Calcul de la pagination
  const pageSize = 10
  const totalPages = Math.ceil(count / pageSize)
  const currentPage = Number.parseInt(searchParams.page) || 1

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produits</h1>
        <Button asChild>
          <Link href="/admin/produits/ajouter">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit..." className="pl-10" defaultValue={searchParams.q || ""} />
        </div>

        <div className="flex gap-2">
          <select className="border rounded px-3 py-2 bg-background" defaultValue={searchParams.category || ""}>
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 bg-background"
            defaultValue={`${searchParams.sort_by || "created_at"}-${searchParams.sort_order || "desc"}`}
          >
            <option value="created_at-desc">Plus récents</option>
            <option value="created_at-asc">Plus anciens</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left font-medium text-sm">Produit</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Prix</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.categories?.name}</td>
                  <td className="px-4 py-3">
                    {product.sale_price ? (
                      <div>
                        <span className="font-medium">{formatPrice(product.sale_price)}</span>
                        <span className="text-xs text-muted-foreground line-through ml-2">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                      {product.stock > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/produits/${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, count)} sur {count}{" "}
            produits
          </p>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              Précédent
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                >
                  {pageNumber}
                </Button>
              )
            })}

            {totalPages > 5 && <span className="px-2">...</span>}

            <Button variant="outline" size="sm" disabled={currentPage === totalPages}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
