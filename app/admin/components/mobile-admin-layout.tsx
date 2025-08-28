"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Menu,
  Bell,
  Search,
  Plus,
  X,
  Store,
  ChevronRight,
  Activity,
  TrendingUp,
  MessageSquare,
  Truck,
  Tag,
  Mail,
  CreditCard,
  FileText,
  Shield,
  Database,
  Zap,
} from "lucide-react"
import Link from "next/link"

const quickActions = [
  { title: "Nouveau produit", href: "/admin/produits/ajouter", icon: Package, color: "bg-blue-500" },
  { title: "Nouvelle commande", href: "/admin/commandes/nouvelle", icon: ShoppingCart, color: "bg-green-500" },
  { title: "Ajouter fournisseur", href: "/admin/fournisseurs/ajouter", icon: Truck, color: "bg-purple-500" },
  { title: "Campagne marketing", href: "/admin/marketing/nouvelle", icon: Mail, color: "bg-orange-500" },
]

const menuSections = [
  {
    title: "Principal",
    items: [
      { title: "Dashboard", href: "/admin", icon: Home, badge: null },
      { title: "Activité", href: "/admin/activite", icon: Activity, badge: "3" },
      { title: "Analytics", href: "/admin/analytics", icon: TrendingUp, badge: null },
    ],
  },
  {
    title: "E-commerce",
    items: [
      { title: "Produits", href: "/admin/produits", icon: Package, badge: null },
      { title: "Commandes", href: "/admin/commandes", icon: ShoppingCart, badge: "12" },
      { title: "Catégories", href: "/admin/categories", icon: Tag, badge: null },
      { title: "Fournisseurs", href: "/admin/fournisseurs", icon: Truck, badge: null },
    ],
  },
  {
    title: "Clients",
    items: [
      { title: "Utilisateurs", href: "/admin/utilisateurs", icon: Users, badge: null },
      { title: "Avis", href: "/admin/avis", icon: MessageSquare, badge: "5" },
      { title: "Marketing", href: "/admin/marketing", icon: Mail, badge: null },
    ],
  },
  {
    title: "Rapports",
    items: [
      { title: "Statistiques", href: "/admin/statistiques", icon: BarChart3, badge: null },
      { title: "Rapports", href: "/admin/rapports", icon: FileText, badge: null },
      { title: "Paiements", href: "/admin/paiements", icon: CreditCard, badge: null },
    ],
  },
  {
    title: "Système",
    items: [
      { title: "Paramètres", href: "/admin/parametres", icon: Settings, badge: null },
      { title: "Sécurité", href: "/admin/securite", icon: Shield, badge: null },
      { title: "Base de données", href: "/admin/database", icon: Database, badge: null },
      { title: "Automatisation", href: "/admin/automatisation", icon: Zap, badge: null },
    ],
  },
]

interface MobileAdminLayoutProps {
  children: React.ReactNode
}

function MobileAdminLayout({ children }: MobileAdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsQuickActionsOpen(false)
  }, [pathname])

  const filteredSections = menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileMenu
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredSections={filteredSections}
                  onClose={() => setIsMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">JammShop</h1>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">3</Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <div className="p-4">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-pb">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "flex-col h-16 px-2 py-2 text-xs gap-1",
              pathname === "/admin" && "text-blue-600 dark:text-blue-400",
            )}
          >
            <Link href="/admin">
              <Home className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "flex-col h-16 px-2 py-2 text-xs gap-1",
              pathname.startsWith("/admin/produits") && "text-blue-600 dark:text-blue-400",
            )}
          >
            <Link href="/admin/produits">
              <Package className="h-5 w-5" />
              <span>Produits</span>
            </Link>
          </Button>

          <Sheet open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex-col h-16 px-2 py-2 text-xs gap-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <span>Ajouter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto rounded-t-3xl">
              <QuickActionsSheet onClose={() => setIsQuickActionsOpen(false)} />
            </SheetContent>
          </Sheet>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "flex-col h-16 px-2 py-2 text-xs gap-1 relative",
              pathname.startsWith("/admin/commandes") && "text-blue-600 dark:text-blue-400",
            )}
          >
            <Link href="/admin/commandes">
              <ShoppingCart className="h-5 w-5" />
              <span>Commandes</span>
              <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">12</Badge>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "flex-col h-16 px-2 py-2 text-xs gap-1",
              pathname.startsWith("/admin/statistiques") && "text-blue-600 dark:text-blue-400",
            )}
          >
            <Link href="/admin/statistiques">
              <BarChart3 className="h-5 w-5" />
              <span>Stats</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MobileMenu({
  searchQuery,
  setSearchQuery,
  filteredSections,
  onClose,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredSections: any[]
  onClose: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">JammShop</h2>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = window.location.pathname === item.href

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start h-12 px-3"
                      onClick={onClose}
                    >
                      <Link href={item.href}>
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="flex-1 text-left">{item.title}</span>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function QuickActionsSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-6">Actions rapides</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Button key={action.href} asChild variant="outline" className="h-20 flex-col gap-2" onClick={onClose}>
              <Link href={action.href}>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", action.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">{action.title}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default MobileAdminLayout
