"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User, Search } from "lucide-react"
import { useCart } from "./cart-provider"
import { Input } from "@/components/ui/input"

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart()

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "Nouveautés", href: "/nouveautes" },
    { name: "Promotions", href: "/promotions" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 nav-gradient backdrop-blur supports-[backdrop-filter]:bg-nav-background/60">
      {/* Use max-w-screen-2xl for a more balanced container width with auto margins */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3 pl-0 sm:pl-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DjigaFlow
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 ml-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 hover:text-nav-hover relative group ${
                  pathname === item.href ? "text-primary" : "text-nav-foreground/80 hover:text-nav-foreground"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full ${
                    pathname === item.href ? "w-full" : ""
                  }`}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Search Bar - Hidden on mobile, centered with proper spacing */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des produits..."
              className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 pr-0 sm:pr-2">
          <Link href="/panier">
            <Button
              variant="outline"
              size="icon"
              className="relative hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          <Button asChild className="btn-gradient-primary hover:shadow-colored transition-all duration-200 px-5">
            <Link href="/connexion">
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Link>
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <Link href="/panier" className="mr-4">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu with improved spacing */}
      {isMenuOpen && (
        <div className="max-w-screen-2xl mx-auto px-4 py-4 md:hidden border-t border-border/40 bg-nav-background/95 backdrop-blur">
          {/* Mobile Search with proper padding */}
          <div className="mb-6 px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher des produits..." className="pl-10 bg-background/50 border-border/50" />
            </div>
          </div>

          <nav className="flex flex-col space-y-3 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary py-3 px-4 rounded-md ${
                  pathname === item.href ? "text-primary bg-primary/10" : "text-nav-foreground/80 hover:bg-muted/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <Button
              asChild
              className="justify-start mt-4 btn-gradient-primary py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/connexion">
                <User className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
