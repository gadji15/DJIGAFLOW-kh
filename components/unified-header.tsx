"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, User, Menu, Heart, Package, Settings, LogOut, Bell, X, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"

const navigation = [
  {
    name: "Accueil",
    href: "/",
    description: "Page d'accueil",
  },
  {
    name: "Catalogue",
    href: "/catalogue",
    description: "Tous nos produits",
    submenu: [
      { name: "Électronique", href: "/catalogue/electronique" },
      { name: "Mode", href: "/catalogue/mode" },
      { name: "Maison", href: "/catalogue/maison" },
      { name: "Sport", href: "/catalogue/sport" },
    ],
  },
  {
    name: "Nouveautés",
    href: "/nouveautes",
    description: "Derniers arrivages",
    badge: "New",
  },
  {
    name: "Promotions",
    href: "/promotions",
    description: "Offres spéciales",
    badge: "Hot",
  },
  {
    name: "Contact",
    href: "/contact",
    description: "Nous contacter",
  },
]

export function UnifiedHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Déconnexion réussie", {
        description: "À bientôt !",
      })
      router.push("/")
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/30 dark:border-slate-700/30"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-white font-bold text-lg lg:text-xl">JS</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl lg:text-2xl bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  JammShop
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Marketplace Premium</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1"
                        >
                          {item.name}
                          <ChevronDown className="w-4 h-4" />
                          {item.badge && (
                            <Badge
                              variant={item.badge === "Hot" ? "destructive" : "secondary"}
                              className="ml-2 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        {item.submenu.map((subItem) => (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link href={subItem.href} className="w-full">
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 flex items-center gap-2 ${
                        pathname === item.href ? "text-blue-600 dark:text-blue-400" : ""
                      }`}
                    >
                      {item.name}
                      {item.badge && (
                        <Badge variant={item.badge === "Hot" ? "destructive" : "secondary"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {pathname === item.href && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="pl-12 pr-4 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Mobile Search */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>

              {/* Favorites */}
              <Button variant="ghost" size="sm" className="hidden sm:flex relative group">
                <Heart className="h-5 w-5 group-hover:text-red-500 transition-colors duration-200" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" asChild className="relative group">
                <Link href="/panier">
                  <ShoppingCart className="h-5 w-5 group-hover:text-blue-600 transition-colors duration-200" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                      {itemCount > 99 ? "99+" : itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/compte" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Mon compte
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/commandes" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Mes commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favoris" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Mes favoris
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">2</Badge>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/parametres" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/connexion">Connexion</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/inscription">Inscription</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <div key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center justify-between px-3 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors ${
                              pathname === item.href ? "bg-muted text-blue-600" : ""
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>{item.name}</span>
                            {item.badge && (
                              <Badge variant={item.badge === "Hot" ? "destructive" : "secondary"} className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                          {item.submenu && (
                            <div className="ml-4 mt-2 space-y-1">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>

                    {/* User Actions */}
                    {isAuthenticated && user ? (
                      <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link
                            href="/compte"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="mr-3 h-4 w-4" />
                            Mon compte
                          </Link>
                          <Link
                            href="/commandes"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Package className="mr-3 h-4 w-4" />
                            Mes commandes
                          </Link>
                          <Link
                            href="/favoris"
                            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Heart className="mr-3 h-4 w-4" />
                            Mes favoris
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout()
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Se déconnecter
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-6 border-t">
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          <Link href="/connexion" onClick={() => setIsMobileMenuOpen(false)}>
                            Connexion
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full bg-transparent">
                          <Link href="/inscription" onClick={() => setIsMobileMenuOpen(false)}>
                            Inscription
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white dark:bg-slate-900 p-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="pl-12 pr-12 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
