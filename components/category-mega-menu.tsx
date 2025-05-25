"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Laptop, Headphones, Shirt, Home, Dumbbell } from "lucide-react"

interface CategoryMegaMenuProps {
  onClose: () => void
}

export function CategoryMegaMenu({ onClose }: CategoryMegaMenuProps) {
  const categories = [
    {
      name: "Électronique",
      icon: <Smartphone className="h-5 w-5" />,
      subcategories: [
        { name: "Smartphones", href: "/catalogue/smartphones", badge: "Hot" },
        { name: "Tablettes", href: "/catalogue/tablettes" },
        { name: "Ordinateurs", href: "/catalogue/ordinateurs" },
        { name: "Accessoires", href: "/catalogue/accessoires-electronique" },
      ],
    },
    {
      name: "Informatique",
      icon: <Laptop className="h-5 w-5" />,
      subcategories: [
        { name: "PC Portables", href: "/catalogue/pc-portables" },
        { name: "PC Bureau", href: "/catalogue/pc-bureau" },
        { name: "Composants", href: "/catalogue/composants" },
        { name: "Périphériques", href: "/catalogue/peripheriques" },
      ],
    },
    {
      name: "Audio & Vidéo",
      icon: <Headphones className="h-5 w-5" />,
      subcategories: [
        { name: "Casques", href: "/catalogue/casques", badge: "New" },
        { name: "Enceintes", href: "/catalogue/enceintes" },
        { name: "TV & Projecteurs", href: "/catalogue/tv-projecteurs" },
        { name: "Home Cinéma", href: "/catalogue/home-cinema" },
      ],
    },
    {
      name: "Mode",
      icon: <Shirt className="h-5 w-5" />,
      subcategories: [
        { name: "Vêtements Homme", href: "/catalogue/vetements-homme" },
        { name: "Vêtements Femme", href: "/catalogue/vetements-femme" },
        { name: "Chaussures", href: "/catalogue/chaussures" },
        { name: "Accessoires Mode", href: "/catalogue/accessoires-mode" },
      ],
    },
    {
      name: "Maison & Jardin",
      icon: <Home className="h-5 w-5" />,
      subcategories: [
        { name: "Mobilier", href: "/catalogue/mobilier" },
        { name: "Décoration", href: "/catalogue/decoration" },
        { name: "Électroménager", href: "/catalogue/electromenager" },
        { name: "Jardin", href: "/catalogue/jardin" },
      ],
    },
    {
      name: "Sport & Loisirs",
      icon: <Dumbbell className="h-5 w-5" />,
      subcategories: [
        { name: "Fitness", href: "/catalogue/fitness" },
        { name: "Sports d'extérieur", href: "/catalogue/sports-exterieur" },
        { name: "Jeux & Jouets", href: "/catalogue/jeux-jouets" },
        { name: "Camping", href: "/catalogue/camping" },
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-[800px] bg-background border border-border rounded-lg shadow-xl p-6"
    >
      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 text-primary font-semibold">
              {category.icon}
              <span>{category.name}</span>
            </div>
            <ul className="space-y-2">
              {category.subcategories.map((sub) => (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={onClose}
                  >
                    <span>{sub.name}</span>
                    {sub.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {sub.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Découvrez toutes nos catégories</div>
          <Link href="/catalogue" className="text-sm text-primary hover:underline font-medium" onClick={onClose}>
            Voir tout le catalogue →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
