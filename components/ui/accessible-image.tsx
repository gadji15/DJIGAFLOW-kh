"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

interface AccessibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  onLoad?: () => void
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  lazy?: boolean
  showAltText?: boolean
  highContrast?: boolean
  reducedMotion?: boolean
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  objectFit = "cover",
  onLoad,
  placeholder = "empty",
  blurDataURL,
  lazy = true,
  showAltText = false,
  highContrast = false,
  reducedMotion = false,
}: AccessibleImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [showAlt, setShowAlt] = useState(showAltText)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, isInView])

  // Gestion du clavier pour l'accessibilité
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setShowAlt(!showAlt)
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", highContrast && "contrast-125 brightness-110", className)}
      style={{
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
      }}
      role="img"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Placeholder pendant le chargement */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Image principale */}
      {isInView && !isError && (
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="w-full h-full"
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            sizes={sizes}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={() => {
              setIsLoaded(true)
              onLoad?.()
            }}
            onError={() => {
              setIsError(true)
            }}
            className={cn(
              "transition-opacity duration-300",
              objectFit === "cover" && "object-cover",
              objectFit === "contain" && "object-contain",
              objectFit === "fill" && "object-fill",
              objectFit === "none" && "object-none",
              objectFit === "scale-down" && "object-scale-down",
            )}
          />
        </motion.div>
      )}

      {/* Fallback en cas d'erreur */}
      {isError && (
        <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
          <EyeOff className="w-8 h-8 mb-2" />
          <span className="text-sm text-center px-2">Image non disponible</span>
          {alt && <span className="text-xs text-center px-2 mt-1 opacity-75">{alt}</span>}
        </div>
      )}

      {/* Overlay avec texte alternatif */}
      {showAlt && alt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="text-white text-center">
            <Eye className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">{alt}</p>
          </div>
        </motion.div>
      )}

      {/* Bouton pour afficher/masquer le texte alternatif */}
      <button
        onClick={() => setShowAlt(!showAlt)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label={showAlt ? "Masquer la description" : "Afficher la description"}
      >
        {showAlt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
