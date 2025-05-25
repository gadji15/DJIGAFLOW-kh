"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ResponsiveContainer,
  ResponsiveFlex,
  ResponsiveButton,
  ResponsiveTypography,
} from "@/components/ui/responsive-design-system"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Heart,
  Bell,
  Phone,
  Mail,
  MapPin,
  Truck,
  Shield,
  ChevronDown,
} from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"

export function ProfessionalHeader() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Accueil", href: "/" },
    {
      name: "Catalogue",
      href: "/catalogue",
      hasDropdown: true,
      dropdownItems: [
        { name: "Tous les produits", href: "/catalogue" },
        { name: "Électronique", href: "/catalogue/electronique" },
        { name: "Mode", href: "/catalogue/mode" },
        { name: "Maison", href: "/catalogue/maison" },
        { name: "Sport", href: "/catalogue/sport" },
      ],
    },
    { name: "Nouveautés", href: "/nouveautes", badge: "New" },
    { name: "Promotions", href: "/promotions", badge: "Hot" }
  ]

  return (
    <>
      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block bg-muted/30 border-b border-border/20">
        <ResponsiveContainer size="full" spacing="none">
          <div className="h-10 flex items-center justify-between text-xs">
            <ResponsiveFlex align="center" gap="lg">
              <Link href="/contact" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-3 w-3" />
                <span>+33 1 23 45 67 89</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-3 w-3" />
                <span>contact@djigaflow.com</span>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-3 w-3" />
                <span>Livraison gratuite dès 50€</span>
              </div>
            </ResponsiveFlex>

            <ResponsiveFlex align="center" gap="lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Livraison en France</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé</span>
              </div>
            </ResponsiveFlex>
          </div>
        </ResponsiveContainer>
      </div>

      {/* Main Header */}
      <motion.header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border-border/40"
            : "bg-background border-border/20",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer size="full" spacing="none">
          <div className="h-16 lg:h-20 flex items-center justify-between">
            {/* Logo Section */}
            <ResponsiveFlex align="center" gap="lg">
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-secondary flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-lg lg:text-xl">D</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.div>
                <div className="hidden sm:block">
                  <ResponsiveTypography variant="h5" color="gradient" className="font-bold">
                    DjigaFlow
                  </ResponsiveTypography>
                  <ResponsiveTypography variant="caption" className="text-muted-foreground">
                    Votre boutique tendance
                  </ResponsiveTypography>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    className="relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-muted/50",
                      )}
                    >
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 animate-pulse">
                          {item.badge}
                        </Badge>
                      )}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4 transition-transform duration-200" />}
                    </Link>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {item.hasDropdown && activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg z-50"
                        >
                          <div className="p-2">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </nav>
            </ResponsiveFlex>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des produits..."
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 h-11"
                />
              </div>
            </div>

            {/* Right Actions */}
            <ResponsiveFlex align="center" gap="sm">
              {/* Mobile Search Toggle */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist - Desktop */}
              <Link href="/liste-souhaits" className="hidden lg:block">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                  <Heart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>
              </Link>

              {/* Notifications - Desktop */}
              <Button variant="ghost" size="icon" className="hidden lg:flex relative hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              </Button>

              {/* Shopping Cart */}
              <Link href="/panier">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 group">
                  <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs font-bold animate-bounce">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account - Desktop */}
              <div className="hidden lg:block">
                <Link href="/connexion" passHref legacyBehavior>
                  <a>
                    <ResponsiveButton variant="gradient" size="md">
                      <User className="h-4 w-4 mr-2" />
                      Connexion
                    </ResponsiveButton>
                  </a>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </ResponsiveFlex>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-border/20 overflow-hidden"
              >
                <div className="py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." className="pl-10" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ResponsiveContainer>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <ResponsiveTypography variant="h6" color="gradient">
                    Menu
                  </ResponsiveTypography>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t space-y-3">
                  <Link href="/connexion" passHref legacyBehavior>
                    <a>
                      <ResponsiveButton variant="gradient" fullWidth>
                        <User className="h-4 w-4 mr-2" />
                        Se connecter
                      </ResponsiveButton>
                    </a>
                  </Link>
                  <ResponsiveTypography variant="caption" align="center">
                    Version 2.0.0 • DjigaFlow
                  </ResponsiveTypography>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
