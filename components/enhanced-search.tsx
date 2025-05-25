"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, Clock, TrendingUp, Star, Tag, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchSuggestion {
  id: string
  type: "product" | "category" | "brand" | "trending"
  title: string
  subtitle?: string
  image?: string
  price?: number
  rating?: number
  category?: string
}

interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  onSale: boolean
  brand: string[]
  sortBy: "relevance" | "price_asc" | "price_desc" | "rating" | "newest"
}

export function EnhancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: true,
    onSale: false,
    brand: [],
    sortBy: "relevance",
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Fermer la recherche en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Charger les recherches récentes
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Recherche avec suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // Simulation d'API - remplacer par vraie API
    await new Promise((resolve) => setTimeout(resolve, 200))

    const mockSuggestions: SearchSuggestion[] = [
      {
        id: "1",
        type: "product",
        title: `Smartphone ${searchQuery}`,
        subtitle: "Électronique",
        price: 299.99,
        rating: 4.5,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        type: "category",
        title: `Catégorie ${searchQuery}`,
        subtitle: "156 produits",
      },
      {
        id: "3",
        type: "trending",
        title: `${searchQuery} tendance`,
        subtitle: "Recherche populaire",
      },
    ]

    setSuggestions(mockSuggestions)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, fetchSuggestions])

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // Sauvegarder dans les recherches récentes
    const newRecentSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)

    setRecentSearches(newRecentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))

    // Naviguer vers les résultats
    const params = new URLSearchParams()
    params.set("q", searchQuery)

    // Ajouter les filtres actifs
    if (filters.category.length > 0) {
      params.set("category", filters.category.join(","))
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      params.set("price", `${filters.priceRange[0]}-${filters.priceRange[1]}`)
    }
    if (filters.rating > 0) {
      params.set("rating", filters.rating.toString())
    }
    if (filters.onSale) {
      params.set("sale", "true")
    }
    if (filters.sortBy !== "relevance") {
      params.set("sort", filters.sortBy)
    }

    router.push(`/recherche?${params.toString()}`)
    setIsOpen(false)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "trending":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "category":
        return <Tag className="h-4 w-4 text-blue-500" />
      case "brand":
        return <Sparkles className="h-4 w-4 text-purple-500" />
      default:
        return <Search className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Rechercher des produits, marques, catégories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSearch()
              }
              if (e.key === "Escape") {
                setIsOpen(false)
              }
            }}
            className="pl-10 pr-20 py-3 text-base bg-background/95 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-200"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-8 w-8 p-0 rounded-lg transition-colors",
                showFilters && "bg-primary text-primary-foreground",
              )}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleSearch()}
              size="sm"
              className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90"
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {/* Panneau de suggestions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-xl border-2 border-border/50 backdrop-blur-xl bg-background/95">
              <CardContent className="p-0">
                {/* Suggestions de recherche */}
                {suggestions.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => {
                            setQuery(suggestion.title)
                            handleSearch(suggestion.title)
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                        >
                          {suggestion.image ? (
                            <img
                              src={suggestion.image || "/placeholder.svg"}
                              alt={suggestion.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center">
                              {getSuggestionIcon(suggestion.type)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm group-hover:text-primary transition-colors">
                              {suggestion.title}
                            </div>
                            {suggestion.subtitle && (
                              <div className="text-xs text-muted-foreground">{suggestion.subtitle}</div>
                            )}
                          </div>
                          {suggestion.price && (
                            <div className="text-sm font-semibold text-primary">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(suggestion.price)}
                            </div>
                          )}
                          {suggestion.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">{suggestion.rating}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recherches récentes */}
                {recentSearches.length > 0 && suggestions.length === 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Recherches récentes
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Effacer
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recherches tendance */}
                <div className="p-4 border-t border-border/50">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Tendances
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["iPhone 15", "Casque gaming", "Sneakers", "Smartwatch", "Écouteurs"].map((trend) => (
                      <Badge
                        key={trend}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        onClick={() => {
                          setQuery(trend)
                          handleSearch(trend)
                        }}
                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de filtres avancés */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-40"
          >
            <Card className="shadow-lg border border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtres avancés</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Catégories */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Catégorie</label>
                    <div className="space-y-2">
                      {["Électronique", "Mode", "Maison", "Sport"].map((cat) => (
                        <label key={cat} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={filters.category.includes(cat)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  category: [...prev.category, cat],
                                }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  category: prev.category.filter((c) => c !== cat),
                                }))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prix (€)</label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: [prev.priceRange[0], Number.parseInt(e.target.value)],
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0€</span>
                        <span>{filters.priceRange[1]}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              inStock: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">En stock</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.onSale}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              onSale: e.target.checked,
                            }))
                          }
                          className="rounded"
                        />
                        <span className="text-sm">En promotion</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        category: [],
                        priceRange: [0, 1000],
                        rating: 0,
                        inStock: true,
                        onSale: false,
                        brand: [],
                        sortBy: "relevance",
                      })
                    }
                  >
                    Réinitialiser
                  </Button>
                  <Button onClick={() => handleSearch()}>Appliquer les filtres</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
