"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, ShoppingCart, User, Heart, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileOptimizedHeaderProps {
  cartItemsCount?: number
  isAuthenticated?: boolean
  userName?: string
}

export function MobileOptimizedHeader({
  cartItemsCount = 0,
  isAuthenticated = false,
  userName,
}: MobileOptimizedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { href: "/catalogue", label: "Catalogue" },
    { href: "/nouveautes", label: "Nouveautés" },
    { href: "/promotions", label: "Promotions" },
    { href: "/marques", label: "Marques" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm sm:text-base">J</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground">JammShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search - Hidden on mobile, shown on tablet+ */}
            <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 p-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>

            {/* Wishlist - Hidden on mobile */}
            <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Liste de souhaits</span>
            </Button>

            {/* Cart */}
            <Link href="/panier">
              <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {cartItemsCount > 9 ? "9+" : cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Panier ({cartItemsCount})</span>
              </Button>
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{userName || "Compte"}</span>
              </Button>
            ) : (
              <Link href="/connexion">
                <Button size="sm" className="h-8 px-3 text-xs">
                  Connexion
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <MobileMenu
                  navigationItems={navigationItems}
                  isAuthenticated={isAuthenticated}
                  userName={userName}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

interface MobileMenuProps {
  navigationItems: Array<{ href: string; label: string }>
  isAuthenticated: boolean
  userName?: string
  onClose: () => void
}

function MobileMenu({ navigationItems, isAuthenticated, userName, onClose }: MobileMenuProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold text-lg">Menu</span>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile-only actions */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <Link
            href="/recherche"
            onClick={onClose}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Search className="h-4 w-4 mr-3" />
            Rechercher
          </Link>
          <Link
            href="/favoris"
            onClick={onClose}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Heart className="h-4 w-4 mr-3" />
            Mes favoris
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center px-3 py-2 text-sm">
              <User className="h-4 w-4 mr-3" />
              {userName || "Mon compte"}
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={onClose}>
              Se déconnecter
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link href="/connexion" onClick={onClose}>
              <Button size="sm" className="w-full">
                Se connecter
              </Button>
            </Link>
            <Link href="/inscription" onClick={onClose}>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                S'inscrire
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
