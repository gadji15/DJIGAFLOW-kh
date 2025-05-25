"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Truck,
  Store,
  CreditCard,
  MessageSquare,
  Shield,
  Database,
  Zap,
  TrendingUp,
  Mail,
  Tag,
  ChevronDown,
  ChevronRight,
  Activity,
} from "lucide-react"
import { SmartNavigation } from "./smart-navigation"

const sidebarSections = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Tableau de bord",
        href: "/admin",
        icon: Home,
        badge: null,
        description: "Vue générale des statistiques",
      },
      {
        title: "Analytique",
        href: "/admin/analytique",
        icon: TrendingUp,
        badge: null,
        description: "Analyses et métriques",
      },
      {
        title: "Activité",
        href: "/admin/activite",
        icon: Activity,
        badge: "3",
        description: "Activité récente",
      },
    ],
  },
  {
    title: "E-commerce",
    items: [
      {
        title: "Produits",
        href: "/admin/produits",
        icon: Package,
        badge: null,
        description: "Gestion des produits",
        subItems: [
          { title: "Tous les produits", href: "/admin/produits" },
          { title: "Ajouter un produit", href: "/admin/produits/ajouter" },
          { title: "Catégories", href: "/admin/categories" },
          { title: "Stock", href: "/admin/stock" },
        ],
      },
      {
        title: "Commandes",
        href: "/admin/commandes",
        icon: ShoppingCart,
        badge: "12",
        description: "Gestion des commandes",
        subItems: [
          { title: "Toutes les commandes", href: "/admin/commandes" },
          { title: "En attente", href: "/admin/commandes/en-attente" },
          { title: "Expédiées", href: "/admin/commandes/expediees" },
          { title: "Retours", href: "/admin/commandes/retours" },
        ],
      },
      {
        title: "Fournisseurs",
        href: "/admin/fournisseurs",
        icon: Truck,
        badge: null,
        description: "Gestion des fournisseurs",
        subItems: [
          { title: "Tous les fournisseurs", href: "/admin/fournisseurs" },
          { title: "Ajouter un fournisseur", href: "/admin/fournisseurs/ajouter" },
          { title: "Synchronisation", href: "/admin/fournisseurs/sync" },
        ],
      },
      {
        title: "Promotions",
        href: "/admin/promotions",
        icon: Tag,
        badge: "3",
        description: "Codes promo et réductions",
      },
    ],
  },
  {
    title: "Clients & Marketing",
    items: [
      {
        title: "Utilisateurs",
        href: "/admin/utilisateurs",
        icon: Users,
        badge: null,
        description: "Gestion des utilisateurs",
      },
      {
        title: "Marketing",
        href: "/admin/marketing",
        icon: Mail,
        badge: null,
        description: "Campagnes marketing",
      },
      {
        title: "Avis & Commentaires",
        href: "/admin/avis",
        icon: MessageSquare,
        badge: "5",
        description: "Modération des avis",
      },
    ],
  },
  {
    title: "Finance & Rapports",
    items: [
      {
        title: "Paiements",
        href: "/admin/paiements",
        icon: CreditCard,
        badge: null,
        description: "Gestion des paiements",
      },
      {
        title: "Statistiques",
        href: "/admin/statistiques",
        icon: BarChart3,
        badge: null,
        description: "Statistiques détaillées",
      },
      {
        title: "Rapports",
        href: "/admin/rapports",
        icon: FileText,
        badge: null,
        description: "Rapports personnalisés",
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Paramètres",
        href: "/admin/parametres",
        icon: Settings,
        badge: null,
        description: "Configuration générale",
      },
      {
        title: "Sécurité",
        href: "/admin/securite",
        icon: Shield,
        badge: null,
        description: "Paramètres de sécurité",
      },
      {
        title: "Base de données",
        href: "/admin/database",
        icon: Database,
        badge: null,
        description: "Gestion de la base",
      },
      {
        title: "Automatisation",
        href: "/admin/automatisation",
        icon: Zap,
        badge: null,
        description: "Tâches automatisées",
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((s) => s !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  const toggleItem = (itemTitle: string) => {
    setExpandedItems((prev) => (prev.includes(itemTitle) ? prev.filter((i) => i !== itemTitle) : [...prev, itemTitle]))
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">DjigaFlow</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
        </div>
        <SmartNavigation />
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-8">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full mb-3 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span>{section.title}</span>
                <motion.div
                  animate={{ rotate: expandedSections.includes(section.title) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {(expandedSections.includes(section.title) || expandedSections.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1"
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      const hasSubItems = item.subItems && item.subItems.length > 0
                      const isExpanded = expandedItems.includes(item.title)

                      return (
                        <div key={item.href}>
                          <div className="relative group">
                            <Button
                              asChild={!hasSubItems}
                              variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-12 px-3 text-left transition-all duration-200",
                                isActive &&
                                  "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 shadow-sm",
                                !isActive && "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm",
                              )}
                              onClick={hasSubItems ? () => toggleItem(item.title) : undefined}
                            >
                              {hasSubItems ? (
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium">{item.title}</span>
                                      {item.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.badge && (
                                      <Badge variant="secondary" className="text-xs">
                                        {item.badge}
                                      </Badge>
                                    )}
                                    <motion.div
                                      animate={{ rotate: isExpanded ? 90 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                  </div>
                                </div>
                              ) : (
                                <Link href={item.href} className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium">{item.title}</span>
                                      {item.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {item.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </Link>
                              )}
                            </Button>

                            {/* Hover tooltip for collapsed state */}
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                              {item.title}
                              {item.badge && (
                                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Sub Items */}
                          <AnimatePresence>
                            {hasSubItems && isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-8 mt-2 space-y-1"
                              >
                                {item.subItems?.map((subItem) => {
                                  const isSubActive = pathname === subItem.href
                                  return (
                                    <Button
                                      key={subItem.href}
                                      asChild
                                      variant={isSubActive ? "secondary" : "ghost"}
                                      className={cn(
                                        "w-full justify-start h-10 px-3 text-sm",
                                        isSubActive &&
                                          "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                                      )}
                                    >
                                      <Link href={subItem.href}>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 mr-3 flex-shrink-0" />
                                        {subItem.title}
                                      </Link>
                                    </Button>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">DjigaFlow Pro</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Version 2.1.0</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
