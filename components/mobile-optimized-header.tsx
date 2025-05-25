"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Search, ShoppingCart, User, Heart, Bell, Home, Grid3X3, Sparkles, Percent, Phone } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { EnhancedSearch } from "@/components/enhanced-search"
import { cn } from "@/lib/utils"

export function MobileOptimizedHeader() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Accueil", href: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Catalogue", href: "/catalogue", icon: <Grid3X3 className="w-5 h-5" /> },
    { name: "Nouveautés", href: "/nouveautes", icon: <Sparkles className="w-5 h-5" />, badge: "New" },
    { name: "Promotions", href: "/promotions", icon: <Percent className="w-5 h-5" />, badge: "Hot" },
    { name: "Contact", href: "/contact", icon: <Phone className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Header principal mobile */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 lg:hidden",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b"
            : "bg-background border-b border-border/20",
        )}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {/* Menu burger */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)} className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DjigaFlow
            </span>
          </Link>

          {/* Actions rapides */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="h-10 w-10">
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/panier">
              <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/20 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <EnhancedSearch />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="h-10 w-10">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu latéral mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-background border-r shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header du menu */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">D</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      DjigaFlow
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                          pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Actions utilisateur */}
                  <div className="mt-8 pt-8 border-t space-y-2">
                    <Link
                      href="/compte"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Mon compte</span>
                    </Link>
                    <Link
                      href="/favoris"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Mes favoris</span>
                      <Badge variant="secondary" className="ml-auto">
                        3
                      </Badge>
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                      <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                    </Link>
                  </div>
                </nav>

                {/* Footer du menu */}
                <div className="p-4 border-t">
                  <Button className="w-full" asChild>
                    <Link href="/connexion" onClick={() => setIsMenuOpen(false)}>
                      Se connecter
                    </Link>
                  </Button>
                  <div className="mt-4 text-center text-xs text-muted-foreground">Version 2.0.0 • DjigaFlow</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation bottom mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40 lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-colors relative",
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.name}</span>
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="absolute top-1 right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  !
                </Badge>
              )}
            </Link>
          ))}

          {/* Menu dans la navigation bottom */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </div>
    </>
  )
}
