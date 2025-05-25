"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EnhancedHeader } from "@/components/enhanced-header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { Filter, Grid3X3, List, X, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  onSale: boolean
  brand: string[]
  sortBy: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get("category")?.split(",") || [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: true,
    onSale: searchParams.get("sale") === "true",
    brand: [],
    sortBy: searchParams.get("sort") || "relevance",
  })

  const query = searchParams.get("q") || ""
  const totalResults = 156 // Simulé

  useEffect(() => {
    // Simuler la recherche
    setLoading(true)
    setTimeout(() => {
      // Ici vous feriez un appel API réel
      setProducts([
        {
          id: 1,
          name: `Résultat pour "${query}" - Smartphone`,
          price: 299.99,
          salePrice: 249.99,
          rating: 4.5,
          reviewsCount: 89,
          image: "/placeholder.svg?height=300&width=300",
        },
        // ... plus de produits
      ])
      setLoading(false)
    }, 1000)
  }, [query, filters])

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    // Mettre à jour l'URL
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (updatedFilters.category.length > 0) {
      params.set("category", updatedFilters.category.join(","))
    }
    if (updatedFilters.onSale) params.set("sale", "true")
    if (updatedFilters.sortBy !== "relevance") {
      params.set("sort", updatedFilters.sortBy)
    }

    router.push(`/recherche?${params.toString()}`)
  }

  const clearFilters = () => {
    updateFilters({
      category: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: true,
      onSale: false,
      brand: [],
      sortBy: "relevance",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader />

      <main className="container mx-auto px-4 py-8">
        {/* En-tête des résultats */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <span>Recherche</span>
            <span>•</span>
            <span>{query}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Résultats pour "{query}"</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-muted-foreground">{totalResults} produits trouvés</p>

            <div className="flex items-center space-x-4">
              {/* Tri */}
              <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Pertinence</SelectItem>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                  <SelectItem value="newest">Plus récents</SelectItem>
                </SelectContent>
              </Select>

              {/* Mode d'affichage */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Filtres mobile */}
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filtres - Desktop */}
          <aside className="hidden lg:block w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtres</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Effacer
                  </Button>
                </div>

                {/* Catégories */}
                <div className="space-y-4">
                  <h4 className="font-medium">Catégories</h4>
                  {["Électronique", "Mode", "Maison", "Sport", "Beauté"].map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.category.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({ category: [...filters.category, category] })
                          } else {
                            updateFilters({
                              category: filters.category.filter((c) => c !== category),
                            })
                          }
                        }}
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>

                {/* Prix */}
                <div className="space-y-4">
                  <h4 className="font-medium">Prix</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{filters.priceRange[0]}€</span>
                      <span>{filters.priceRange[1]}€</span>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-4">
                  <h4 className="font-medium">Note minimum</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.rating === rating}
                          onCheckedChange={(checked) => {
                            updateFilters({ rating: checked ? rating : 0 })
                          }}
                        />
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm">& plus</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <h4 className="font-medium">Options</h4>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.inStock}
                      onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
                    />
                    <span className="text-sm">En stock uniquement</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.onSale}
                      onCheckedChange={(checked) => updateFilters({ onSale: !!checked })}
                    />
                    <span className="text-sm">En promotion</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Résultats */}
          <div className="flex-1">
            {/* Filtres actifs */}
            {(filters.category.length > 0 || filters.onSale || filters.rating > 0) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.category.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {category}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() =>
                          updateFilters({
                            category: filters.category.filter((c) => c !== category),
                          })
                        }
                      />
                    </Badge>
                  ))}
                  {filters.onSale && (
                    <Badge variant="secondary" className="gap-1">
                      En promotion
                      <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ onSale: false })} />
                    </Badge>
                  )}
                  {filters.rating > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.rating}+ étoiles
                      <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ rating: 0 })} />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Grille de produits */}
            {loading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
                )}
              >
                {products.map((product: any) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" disabled>
                  Précédent
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline">10</Button>
                <Button variant="outline">Suivant</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SearchResults />
    </Suspense>
  )
}
