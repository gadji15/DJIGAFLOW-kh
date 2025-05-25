"use client"

import type React from "react"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Heart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useNotification } from "@/components/ui/notification"

interface ProductCardProps {
  id: string | number
  name: string
  price: number
  salePrice?: number | null
  rating: number
  reviewsCount?: number
  image?: string
}

export function ProductCard({
  id,
  name,
  price,
  salePrice,
  rating,
  reviewsCount = 0,
  image = "/placeholder.svg?height=300&width=300",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { showNotification } = useNotification()

  // Calculer le pourcentage de réduction
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0

  const product = {
    id,
    name,
    price,
    salePrice,
    images: [image],
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)

    showNotification({
      type: isFavorite ? "info" : "success",
      title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      message: isFavorite
        ? `${name} a été retiré de votre liste de souhaits.`
        : `${name} a été ajouté à votre liste de souhaits.`,
      duration: 3000,
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Logique pour afficher la vue rapide du produit
    console.log("Quick view", id)
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/30 group h-full flex flex-col">
        <Link href={`/produit/${id}`} className="block relative">
          <div className="relative aspect-square bg-muted/30 overflow-hidden">
            <OptimizedImage
              src={image}
              alt={name}
              fill
              objectFit="cover"
              className="transition-transform duration-700 group-hover:scale-105"
            />

            {/* Discount Badge */}
            {salePrice && salePrice < price && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="destructive" className="font-bold px-2 py-1">
                  -{discount}%
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 ${
                  isFavorite ? "text-red-500 hover:text-red-600" : ""
                }`}
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Quick View Overlay */}
            <div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button variant="secondary" size="sm" className="px-5 py-2.5 backdrop-blur-sm" onClick={handleQuickView}>
                <Eye className="h-4 w-4 mr-2" />
                Aperçu rapide
              </Button>
            </div>
          </div>
        </Link>

        {/* Card Content */}
        <CardContent className="p-5 flex flex-col flex-1">
          <Link href={`/produit/${id}`} className="block flex-1">
            <h3 className="font-semibold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({reviewsCount})</span>
            </div>
          </Link>

          {/* Price and Add to Cart */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {salePrice ? (
                  <>
                    <span className="font-bold text-price text-lg">{formatPrice(salePrice)}</span>
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>
                  </>
                ) : (
                  <span className="font-bold text-foreground text-lg">{formatPrice(price)}</span>
                )}
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
