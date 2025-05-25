"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, ChevronDown, Heart, Bell, Search, Phone, Mail, MapPin, Truck, Shield } from "lucide-react"
import { useCart } from "./cart-provider"
import { AnimatedLogo } from "./ui/animated-logo"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface NavItem {
  name: string
  href: string
  badge?: string
  hasDropdown?: boolean
  dropdownId?: string
  icon?: React.ReactNode
  isNew?: boolean
  children?: NavItem[]
}

export function EnhancedNavigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { itemCount } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems: NavItem[] = [
    {
      name: "Catalogue",
      href: "/catalogue",
      hasDropdown: true,
      dropdownId: "categories",
      children: [
        { name: "Électronique", href: "/catalogue/electronique" },
        { name: "Mode", href: "/catalogue/mode" },
        { name: "Maison & Jardin", href: "/catalogue/maison" },
        { name: "Sport & Loisirs", href: "/catalogue/sport" },
        { name: "Beauté & Santé", href: "/catalogue/beaute" },
      ],
    },
    { name: "Nouveautés", href: "/nouveautes", isNew: true },
    { name: "Promotions", href: "/promotions", badge: "Hot" },
    { name: "Marques", href: "/marques" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ]

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
    // Reset search field
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-muted/30 border-b border-border/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>contact@djigaflow.com</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="h-3 w-3" />
                <span>Livraison gratuite dès 50€</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Livraison en France</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/40"
            : "bg-background border-b border-border/20",
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <AnimatedLogo size="md" />

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
                {navItems.map((item) => (
                  <div key={item.href} className="relative">
                    <div
                      className={cn(
                        "flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        item.hasDropdown && "cursor-pointer",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-muted/50",
                      )}
                      onClick={() => (item.hasDropdown ? toggleDropdown(item.dropdownId!) : null)}
                    >
                      {item.hasDropdown ? (
                        <>
                          <span>{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-200",
                              activeDropdown === item.dropdownId ? "rotate-180" : "",
                            )}
                          />
                        </>
                      ) : (
                        <Link href={item.href} className="flex items-center space-x-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                              {item.badge}
                            </Badge>
                          )}
                          {item.isNew && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              New
                            </Badge>
                          )}
                        </Link>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {item.hasDropdown && activeDropdown === item.dropdownId && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 z-50 bg-background rounded-lg shadow-lg border border-border/50 p-4 min-w-[200px]"
                        >
                          <div className="grid gap-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8" ref={searchRef}>
              <div className="relative w-full">
                <form onSubmit={handleSearch}>
                  <Input
                    type="search"
                    placeholder="Rechercher des produits..."
                    className={cn(
                      "pl-10 pr-4 py-2 bg-background/50 border-border/50 transition-all duration-300",
                      isSearchFocused
                        ? "bg-background border-primary/50 shadow-sm"
                        : "focus:bg-background focus:border-primary/50",
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </form>

                {/* Search Suggestions */}
                <AnimatePresence>
                  {isSearchFocused && searchQuery.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-background rounded-lg shadow-lg border border-border/50 p-4 z-50"
                    >
                      <div className="text-sm font-medium mb-2">Suggestions</div>
                      <div className="space-y-2">
                        {/* Example suggestions */}
                        <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span>{searchQuery} en électronique</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span>{searchQuery} en mode</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Wishlist - Desktop */}
              <Link href="/liste-souhaits" className="hidden lg:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <Heart className="h-5 w-5" />
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </Link>

              {/* Notifications - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex relative hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              </Button>

              {/* Shopping Cart */}
              <Link href="/panier">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs font-bold animate-bounce"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account - Desktop */}
              <div className="hidden lg:block">
                <Button
                  asChild
                  className="bg-gradient-to-r from-primary to-primary-hover hover:shadow-md transition-all duration-200"
                >
                  <Link href="/connexion" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Connexion</span>
                  </Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <div className="relative w-5 h-5">
                  <span
                    className={cn(
                      "absolute block w-5 h-0.5 bg-current transition-all duration-300",
                      isMenuOpen ? "rotate-45 top-2" : "top-1",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute block w-5 h-0.5 bg-current transition-all duration-300 top-2",
                      isMenuOpen ? "opacity-0" : "opacity-100",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute block w-5 h-0.5 bg-current transition-all duration-300",
                      isMenuOpen ? "-rotate-45 top-2" : "top-3",
                    )}
                  />
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Rechercher des produits..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="border-t border-border/20 bg-background/95 backdrop-blur-sm">
                <div className="max-w-screen-2xl mx-auto px-4 py-6">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2 mb-6">
                    {navItems.map((item) => (
                      <div key={item.href}>
                        {item.hasDropdown ? (
                          <div
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                            onClick={() => toggleDropdown(`mobile-${item.dropdownId}`)}
                          >
                            <span className="font-medium">{item.name}</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                activeDropdown === `mobile-${item.dropdownId}` ? "rotate-180" : "",
                              )}
                            />
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg transition-colors duration-200",
                              pathname === item.href ? "text-primary bg-primary/10" : "hover:bg-muted/50",
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="font-medium">{item.name}</span>
                            {item.badge && (
                              <Badge variant="destructive" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            {item.isNew && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                          </Link>
                        )}

                        {/* Mobile Dropdown Content */}
                        <AnimatePresence>
                          {item.hasDropdown && activeDropdown === `mobile-${item.dropdownId}` && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 ml-4 space-y-2 animate-fade-in">
                                {item.children?.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className="block p-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </nav>

                  {/* Mobile Quick Actions */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link
                      href="/liste-souhaits"
                      className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Liste de souhaits</span>
                    </Link>

                    <Link
                      href="/compte"
                      className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Mon compte</span>
                    </Link>
                  </div>

                  {/* Mobile CTA */}
                  <div className="space-y-3">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-primary to-primary-hover"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/connexion">
                        <User className="h-4 w-4 mr-2" />
                        Se connecter
                      </Link>
                    </Button>

                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Truck className="h-3 w-3" />
                        <span>Livraison gratuite</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>Paiement sécurisé</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
