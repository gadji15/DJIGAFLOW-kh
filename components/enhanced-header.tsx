"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ShoppingCart,
  User,
  ChevronDown,
  Heart,
  Bell,
  Search,
  Phone,
  Mail,
  MapPin,
  Truck,
  Shield,
  Menu,
  Settings,
  LogOut,
  Package,
  CreditCard,
} from "lucide-react"
import { useCart } from "./cart-provider"
import { SearchWithAutocomplete } from "./search-autocomplete"
import { CategoryMegaMenu } from "./category-mega-menu"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./auth-provider"
import { toast } from "sonner"

export function EnhancedHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { itemCount } = useCart()
  const { user, loading } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    {
      name: "Accueil",
      href: "/",
    },
    {
      name: "Catalogue",
      href: "/catalogue",
      hasDropdown: true,
      dropdownId: "categories",
    },
    {
      name: "Nouveautés",
      href: "/nouveautes",
      badge: "New",
    },
    {
      name: "Promotions",
      href: "/promotions",
      badge: "Hot",
    },
    {
      name: "À propos",
      href: "/a-propos",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ]

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Déconnexion réussie")
      router.push("/")
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-muted/30 border-b border-border/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            <div className="flex items-center space-x-6 text-muted-foreground">
              <Link href="/contact" className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Phone className="h-3 w-3" />
                <span>+33 1 23 45 67 89</span>
              </Link>
              <Link href="/contact" className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Mail className="h-3 w-3" />
                <span>contact@djigaflow.com</span>
              </Link>
              <Link href="/livraison" className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Truck className="h-3 w-3" />
                <span>Livraison gratuite dès 50€</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link href="/livraison" className="flex items-center space-x-1 hover:text-primary transition-colors">
                <MapPin className="h-3 w-3" />
                <span>Livraison en France</span>
              </Link>
              <Link href="/securite" className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/40"
            : "bg-background border-b border-border/20"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section */}
            <motion.div
              className="flex items-center space-x-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-secondary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <span className="text-primary-foreground font-bold text-lg lg:text-xl">D</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent">
                    DjigaFlow
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">Votre boutique tendance</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-muted/50"
                      }`}
                      onClick={() => (item.hasDropdown ? toggleDropdown(item.dropdownId!) : null)}
                    >
                      {item.hasDropdown ? (
                        <>
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              activeDropdown === item.dropdownId ? "rotate-180" : ""
                            }`}
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
                        </Link>
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {item.hasDropdown && activeDropdown === item.dropdownId && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 z-50"
                        >
                          <CategoryMegaMenu onClose={() => setActiveDropdown(null)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <SearchWithAutocomplete />
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

              {/* User Account */}
              <div className="hidden lg:block">
                {loading ? (
                  <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.user_metadata?.full_name || "Utilisateur"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
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
                        <Link href="/paiements" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Moyens de paiement
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/liste-souhaits" className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          Liste de souhaits
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.user_metadata?.role === "admin" && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              Administration
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    asChild
                    className="btn-gradient-primary hover:shadow-colored transition-all duration-200 px-5"
                  >
                    <Link href="/connexion">
                      <User className="h-4 w-4 mr-2" />
                      Connexion
                    </Link>
                  </Button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>Navigation et compte utilisateur</SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Rechercher..." className="pl-10" />
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                            pathname === item.href ? "text-primary bg-primary/10" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile User Section */}
                    {user ? (
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center space-x-3 p-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.user_metadata?.full_name || "Utilisateur"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>

                        <Link
                          href="/compte"
                          className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="mr-3 h-5 w-5" />
                          Mon compte
                        </Link>

                        <Link
                          href="/commandes"
                          className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Package className="mr-3 h-5 w-5" />
                          Mes commandes
                        </Link>

                        <Link
                          href="/liste-souhaits"
                          className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="mr-3 h-5 w-5" />
                          Liste de souhaits
                        </Link>

                        {user.user_metadata?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Settings className="mr-3 h-5 w-5" />
                            Administration
                          </Link>
                        )}

                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            handleSignOut()
                            setIsMenuOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Se déconnecter
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-4 border-t">
                        <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                          <Link href="/connexion">
                            <User className="h-4 w-4 mr-2" />
                            Se connecter
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                          <Link href="/inscription">Créer un compte</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <SearchWithAutocomplete />
          </div>
        </div>
      </motion.header>
    </>
  )
}
