"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Truck,
  Menu,
  X,
  Store,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Shield,
  Database,
  Zap,
  Mail,
  Tag,
  Layers,
  Activity,
  Search,
  Plus,
} from "lucide-react"

const quickAccessItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    badge: null,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Produits",
    href: "/admin/produits",
    icon: Package,
    badge: null,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Commandes",
    href: "/admin/commandes",
    icon: ShoppingCart,
    badge: "12",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Plus",
    href: "#",
    icon: Menu,
    badge: null,
    color: "from-gray-500 to-gray-600",
    isMenu: true,
  },
]

const allMenuItems = [
  {
    category: "Vue d'ensemble",
    items: [
      { title: "Tableau de bord", href: "/admin", icon: Home, badge: null },
      { title: "Analytique", href: "/admin/analytique", icon: TrendingUp, badge: null },
      { title: "Activité", href: "/admin/activite", icon: Activity, badge: "3" },
    ],
  },
  {
    category: "E-commerce",
    items: [
      { title: "Produits", href: "/admin/produits", icon: Package, badge: null },
      { title: "Commandes", href: "/admin/commandes", icon: ShoppingCart, badge: "12" },
      { title: "Fournisseurs", href: "/admin/fournisseurs", icon: Truck, badge: null },
      { title: "Catégories", href: "/admin/categories", icon: Layers, badge: null },
      { title: "Promotions", href: "/admin/promotions", icon: Tag, badge: "3" },
    ],
  },
  {
    category: "Clients & Marketing",
    items: [
      { title: "Utilisateurs", href: "/admin/utilisateurs", icon: Users, badge: null },
      { title: "Marketing", href: "/admin/marketing", icon: Mail, badge: null },
      { title: "Avis", href: "/admin/avis", icon: MessageSquare, badge: "5" },
    ],
  },
  {
    category: "Finance & Rapports",
    items: [
      { title: "Paiements", href: "/admin/paiements", icon: CreditCard, badge: null },
      { title: "Statistiques", href: "/admin/statistiques", icon: BarChart3, badge: null },
      { title: "Rapports", href: "/admin/rapports", icon: FileText, badge: null },
    ],
  },
  {
    category: "Configuration",
    items: [
      { title: "Paramètres", href: "/admin/parametres", icon: Settings, badge: null },
      { title: "Sécurité", href: "/admin/securite", icon: Shield, badge: null },
      { title: "Base de données", href: "/admin/database", icon: Database, badge: null },
      { title: "Automatisation", href: "/admin/automatisation", icon: Zap, badge: null },
    ],
  },
]

const floatingActions = [
  { title: "Ajouter Produit", href: "/admin/produits/ajouter", icon: Package },
  { title: "Nouvelle Commande", href: "/admin/commandes/nouvelle", icon: ShoppingCart },
  { title: "Ajouter Fournisseur", href: "/admin/fournisseurs/ajouter", icon: Truck },
]

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [showFAB, setShowFAB] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  // Close mobile nav when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Show/hide floating action button based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFAB(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const filteredItems = allMenuItems
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((category) => category.items.length > 0)

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2 safe-area-pb">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href && !item.isMenu
            const isMenu = item.isMenu

            if (isMenu) {
              return (
                <Sheet key="menu" open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="flex-col h-16 px-2 py-2 text-xs gap-1 relative overflow-hidden">
                      <motion.div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                          item.color,
                          "shadow-lg",
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-t-0 p-0">
                    <MobileMenuContent
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filteredItems={filteredItems}
                      onClose={() => setIsOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              )
            }

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className="flex-col h-16 px-2 py-2 text-xs gap-1 relative overflow-hidden"
              >
                <Link href={item.href}>
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      isActive ? "from-blue-500 to-blue-600" : item.color,
                      "shadow-lg relative",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: isActive ? [1, 1.1, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                    {item.badge && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {item.badge}
                      </motion.div>
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "font-medium",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {item.title}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showFAB && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="lg:hidden fixed bottom-20 right-4 z-50"
          >
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto rounded-t-3xl p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle>Actions rapides</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-3">
                  {floatingActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Button key={action.href} asChild variant="outline" className="h-14 justify-start gap-4">
                        <Link href={action.href}>
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">{action.title}</span>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for bottom navigation */}
      <div className="lg:hidden h-20" />
    </>
  )
}

function MobileMenuContent({
  searchQuery,
  setSearchQuery,
  filteredItems,
  onClose,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredItems: any[]
  onClose: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">JammShop</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans le menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {filteredItems.map((category) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">
                {category.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {category.items.map((item) => {
                  const Icon = item.icon
                  const isActive = window.location.pathname === item.href

                  return (
                    <motion.div key={item.href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        variant={isActive ? "default" : "outline"}
                        className="h-20 flex-col gap-2 w-full relative overflow-hidden"
                        onClick={onClose}
                      >
                        <Link href={item.href}>
                          <div className="relative">
                            <Icon className="h-6 w-6" />
                            {item.badge && (
                              <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm font-medium text-center leading-tight">{item.title}</span>
                        </Link>
                      </Button>
                    </motion.div>
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
