"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedCard } from "@/components/ui/optimized-layout"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { cn, formatPrice, calculateDiscount } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  sale_price?: number | null
  images: string[]
  rating: number
  reviews_count: number
  featured: boolean
  stock: number
}

interface MobileOptimizedProductCardProps {
  product: Product
  variant?: "default" | "compact" | "featured"
  showQuickActions?: boolean
  className?: string
}

export function MobileOptimizedProductCard({
  product,
  variant = "default",
  showQuickActions = true,
  className,
}: MobileOptimizedProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discount = product.sale_price ? calculateDiscount(product.price, product.sale_price) : 0

  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"

  return (
    <OptimizedCard
      variant={isCompact ? "compact" : "default"}
      padding="sm"
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        isFeatured && "ring-2 ring-primary/20",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Link href={`/produit/${product.slug}`}>
          <Image
            src={product.images[0] || "/placeholder.svg?height=200&width=200"}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-300",
              "group-hover:scale-105",
              !imageLoaded && "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              Vedette
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
              -{discount}%
            </Badge>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-background/80">
              Stock limité
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 w-7 p-0 bg-background/80 hover:bg-background"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current text-red-500")} />
              <span className="sr-only">Ajouter aux favoris</span>
            </Button>
            <Button size="sm" variant="secondary" className="h-7 w-7 p-0 bg-background/80 hover:bg-background" asChild>
              <Link href={`/produit/${product.slug}`}>
                <Eye className="h-3.5 w-3.5" />
                <span className="sr-only">Voir le produit</span>
              </Link>
            </Button>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              Rupture de stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-3 space-y-2">
        {/* Title */}
        <Link href={`/produit/${product.slug}`}>
          <h3
            className={cn(
              "font-medium line-clamp-2 hover:text-primary transition-colors",
              isCompact ? "text-sm" : "text-sm sm:text-base",
            )}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.reviews_count > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.sale_price ? (
            <>
              <span className="font-semibold text-sm sm:text-base text-primary">{formatPrice(product.sale_price)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-semibold text-sm sm:text-base">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        {product.stock > 0 && (
          <Button
            size="sm"
            className="w-full h-8 text-xs"
            onClick={(e) => {
              e.preventDefault()
              // Add to cart logic here
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Ajouter au panier
          </Button>
        )}
      </div>
    </OptimizedCard>
  )
}
