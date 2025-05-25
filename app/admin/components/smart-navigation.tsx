"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Truck,
  CreditCard,
  MessageSquare,
  Shield,
  Database,
  Zap,
  TrendingUp,
  Mail,
  Tag,
  Activity,
  Search,
  Star,
} from "lucide-react"

interface NavigationItem {
  id: string
  title: string
  href: string
  icon: any
  badge?: string
  description?: string
  category: string
  keywords: string[]
  priority: number
  lastAccessed?: Date
  accessCount: number
  isNew?: boolean
  isFavorite?: boolean
}

const navigationItems: NavigationItem[] = [
  // Vue d'ensemble
  {
    id: "dashboard",
    title: "Tableau de bord",
    href: "/admin",
    icon: Home,
    description: "Vue d'ensemble des statistiques et métriques",
    category: "Vue d'ensemble",
    keywords: ["dashboard", "accueil", "statistiques", "métriques", "overview"],
    priority: 10,
    accessCount: 0,
  },
  {
    id: "analytics",
    title: "Analytique",
    href: "/admin/analytics",
    icon: TrendingUp,
    description: "Analyses détaillées et rapports de performance",
    category: "Vue d'ensemble",
    keywords: ["analytics", "analyse", "rapports", "performance", "données"],
    priority: 8,
    accessCount: 0,
  },
  {
    id: "activity",
    title: "Activité",
    href: "/admin/activite",
    icon: Activity,
    badge: "3",
    description: "Journal d'activité et événements récents",
    category: "Vue d'ensemble",
    keywords: ["activité", "journal", "événements", "logs", "historique"],
    priority: 6,
    accessCount: 0,
  },

  // E-commerce
  {
    id: "products",
    title: "Produits",
    href: "/admin/produits",
    icon: Package,
    description: "Gestion complète du catalogue produits",
    category: "E-commerce",
    keywords: ["produits", "catalogue", "inventory", "stock", "articles"],
    priority: 9,
    accessCount: 0,
  },
  {
    id: "orders",
    title: "Commandes",
    href: "/admin/commandes",
    icon: ShoppingCart,
    badge: "12",
    description: "Suivi et gestion des commandes clients",
    category: "E-commerce",
    keywords: ["commandes", "orders", "ventes", "clients", "transactions"],
    priority: 9,
    accessCount: 0,
  },
  {
    id: "suppliers",
    title: "Fournisseurs",
    href: "/admin/fournisseurs",
    icon: Truck,
    description: "Gestion des fournisseurs et synchronisation",
    category: "E-commerce",
    keywords: ["fournisseurs", "suppliers", "dropshipping", "sync", "partenaires"],
    priority: 7,
    accessCount: 0,
  },
  {
    id: "categories",
    title: "Catégories",
    href: "/admin/categories",
    icon: Tag,
    description: "Organisation et gestion des catégories",
    category: "E-commerce",
    keywords: ["catégories", "classification", "organisation", "taxonomie"],
    priority: 5,
    accessCount: 0,
  },

  // Clients & Marketing
  {
    id: "users",
    title: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
    description: "Gestion des comptes utilisateurs",
    category: "Clients & Marketing",
    keywords: ["utilisateurs", "clients", "comptes", "membres", "users"],
    priority: 7,
    accessCount: 0,
  },
  {
    id: "marketing",
    title: "Marketing",
    href: "/admin/marketing",
    icon: Mail,
    description: "Campagnes marketing et communication",
    category: "Clients & Marketing",
    keywords: ["marketing", "campagnes", "email", "promotion", "communication"],
    priority: 6,
    accessCount: 0,
  },
  {
    id: "reviews",
    title: "Avis clients",
    href: "/admin/avis",
    icon: MessageSquare,
    badge: "5",
    description: "Modération et gestion des avis",
    category: "Clients & Marketing",
    keywords: ["avis", "reviews", "commentaires", "feedback", "modération"],
    priority: 5,
    accessCount: 0,
  },

  // Finance & Rapports
  {
    id: "payments",
    title: "Paiements",
    href: "/admin/paiements",
    icon: CreditCard,
    description: "Gestion des transactions et paiements",
    category: "Finance & Rapports",
    keywords: ["paiements", "transactions", "finance", "money", "billing"],
    priority: 8,
    accessCount: 0,
  },
  {
    id: "statistics",
    title: "Statistiques",
    href: "/admin/statistiques",
    icon: BarChart3,
    description: "Statistiques détaillées et KPIs",
    category: "Finance & Rapports",
    keywords: ["statistiques", "stats", "kpi", "métriques", "performance"],
    priority: 7,
    accessCount: 0,
  },
  {
    id: "reports",
    title: "Rapports",
    href: "/admin/rapports",
    icon: FileText,
    description: "Génération de rapports personnalisés",
    category: "Finance & Rapports",
    keywords: ["rapports", "reports", "export", "documents", "analyse"],
    priority: 6,
    accessCount: 0,
  },

  // Configuration
  {
    id: "settings",
    title: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    description: "Configuration générale du système",
    category: "Configuration",
    keywords: ["paramètres", "settings", "configuration", "options", "préférences"],
    priority: 5,
    accessCount: 0,
  },
  {
    id: "security",
    title: "Sécurité",
    href: "/admin/securite",
    icon: Shield,
    description: "Paramètres de sécurité et accès",
    category: "Configuration",
    keywords: ["sécurité", "security", "protection", "accès", "permissions"],
    priority: 6,
    accessCount: 0,
  },
  {
    id: "database",
    title: "Base de données",
    href: "/admin/database",
    icon: Database,
    description: "Gestion et maintenance de la base",
    category: "Configuration",
    keywords: ["database", "base", "données", "backup", "maintenance"],
    priority: 4,
    accessCount: 0,
  },
  {
    id: "automation",
    title: "Automatisation",
    href: "/admin/automatisation",
    icon: Zap,
    description: "Tâches automatisées et workflows",
    category: "Configuration",
    keywords: ["automatisation", "automation", "workflows", "tâches", "cron"],
    priority: 5,
    accessCount: 0,
  },
]

export function SmartNavigation() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentItems, setRecentItems] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  // Charger les favoris et éléments récents depuis localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("admin-favorites")
    const savedRecent = localStorage.getItem("admin-recent")

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedRecent) setRecentItems(JSON.parse(savedRecent))
  }, [])

  // Sauvegarder les favoris
  useEffect(() => {
    localStorage.setItem("admin-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Sauvegarder les éléments récents
  useEffect(() => {
    localStorage.setItem("admin-recent", JSON.stringify(recentItems))
  }, [recentItems])

  // Raccourcis clavier
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Filtrer les éléments selon la recherche
  const filteredItems = useMemo(() => {
    if (!searchQuery) return navigationItems

    return navigationItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }, [searchQuery])

  // Grouper par catégorie
  const groupedItems = useMemo(() => {
    const groups: Record<string, NavigationItem[]> = {}

    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push({
        ...item,
        isFavorite: favorites.includes(item.id),
        lastAccessed: recentItems.includes(item.id) ? new Date() : undefined,
      })
    })

    // Trier chaque groupe par priorité
    Object.keys(groups).forEach((category) => {
      groups[category].sort((a, b) => b.priority - a.priority)
    })

    return groups
  }, [filteredItems, favorites, recentItems])

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const addToRecent = (itemId: string) => {
    setRecentItems((prev) => {
      const filtered = prev.filter((id) => id !== itemId)
      return [itemId, ...filtered].slice(0, 10) // Garder seulement les 10 derniers
    })
  }

  const handleSelect = (href: string, itemId: string) => {
    addToRecent(itemId)
    router.push(href)
    setOpen(false)
  }

  const favoriteItems = navigationItems.filter((item) => favorites.includes(item.id))
  const recentItemsData = navigationItems.filter((item) => recentItems.includes(item.id))

  return (
    <>
      {/* Bouton de recherche */}
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Rechercher...</span>
        <span className="inline-flex lg:hidden">Recherche</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Dialog de commande */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Rechercher dans l'administration..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

          {/* Favoris */}
          {favoriteItems.length > 0 && (
            <>
              <CommandGroup heading="⭐ Favoris">
                {favoriteItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item.href, item.id)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Récents */}
          {recentItemsData.length > 0 && (
            <>
              <CommandGroup heading="🕒 Récents">
                {recentItemsData.slice(0, 5).map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item.href, item.id)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            favorites.includes(item.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400",
                          )}
                        />
                      </Button>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Toutes les catégories */}
          {Object.entries(groupedItems).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item.href, item.id)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.isNew && (
                          <Badge variant="default" className="text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(item.id)
                      }}
                    >
                      <Star
                        className={cn("h-3 w-3", item.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400")}
                      />
                    </Button>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
