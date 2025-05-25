"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
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
  placeholder?: "blur" | "empty" | "shimmer"
  blurDataURL?: string
}

export function OptimizedImage({
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
  placeholder = "shimmer",
  blurDataURL,
}: OptimizedImageProps) {
  // Always ensure alt is a valid string
  const altText = alt && alt.trim().length > 0 ? alt : "Image"
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "200px",
      },
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [priority])

  // Generate shimmer placeholder
  const shimmerPlaceholder = `
    <svg width="100%" height="100%" viewBox="0 0 ${width || 400} ${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0.4" stopColor="#f6f7f8" stopOpacity="1"></stop>
          <stop offset="0.5" stopColor="#edeef1" stopOpacity="1"></stop>
          <stop offset="0.6" stopColor="#f6f7f8" stopOpacity="1"></stop>
        </linearGradient>
        <mask id="shimmerMask">
          <rect width="100%" height="100%" fill="url(#shimmer)"></rect>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="#f6f7f8"></rect>
      <rect width="100%" height="100%" fill="#edeef1" mask="url(#shimmerMask)">
        <animate attributeName="x" from="-100%" to="100%" dur="1.5s" repeatCount="indefinite"></animate>
      </rect>
    </svg>
  `

  const shimmerDataUrl = `data:image/svg+xml;base64,${Buffer.from(shimmerPlaceholder).toString("base64")}`

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", !isLoaded && placeholder === "shimmer" && "animate-pulse", className)}
      style={{
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
      }}
    >
      {(priority || isInView) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={altText}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          sizes={sizes}
          quality={quality}
          onLoad={() => {
            setIsLoaded(true)
            onLoad?.()
          }}
          placeholder={placeholder === "shimmer" ? "blur" : placeholder}
          blurDataURL={placeholder === "shimmer" ? shimmerDataUrl : blurDataURL}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            objectFit === "scale-down" && "object-scale-down",
          )}
        />
      )}
    </div>
  )
}
