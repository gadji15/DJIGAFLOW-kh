"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedImageProps {
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
  effect?: "none" | "zoom" | "fade" | "blur" | "reveal"
  aspectRatio?: "auto" | "square" | "video" | "portrait" | "wide"
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

export function EnhancedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 90,
  objectFit = "cover",
  onLoad,
  effect = "none",
  aspectRatio = "auto",
  rounded = "none",
}: EnhancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageSrc, setImageSrc] = useState(src)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Handle image error
  useEffect(() => {
    setImageSrc(src)
  }, [src])

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

  // Aspect ratio classes
  const aspectRatioClasses = {
    auto: "",
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  }

  // Rounded classes
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }

  // Effect variants
  const effectVariants = {
    none: {},
    zoom: {
      initial: { scale: 1.2 },
      animate: { scale: 1, transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    },
    blur: {
      initial: { filter: "blur(10px)", opacity: 0 },
      animate: {
        filter: "blur(0px)",
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      },
    },
    reveal: {
      initial: { clipPath: "inset(0 100% 0 0)" },
      animate: {
        clipPath: "inset(0 0% 0 0)",
        transition: { duration: 1, ease: [0.25, 1, 0.5, 1] },
      },
    },
  }

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", aspectRatioClasses[aspectRatio], roundedClasses[rounded], className)}
      style={{
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
      }}
    >
      {isLoading && <div className="absolute inset-0 bg-muted/30 animate-pulse" />}

      {(priority || isInView) && (
        <motion.div
          initial={effect !== "none" ? effectVariants[effect].initial : undefined}
          animate={effect !== "none" ? effectVariants[effect].animate : undefined}
          className="h-full w-full"
        >
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            priority={priority}
            sizes={sizes}
            quality={quality}
            onLoad={() => {
              setIsLoading(false)
              onLoad?.()
            }}
            onError={() => {
              setImageSrc("/placeholder.svg")
              setIsLoading(false)
            }}
            className={cn(
              "transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              objectFit === "cover" && "object-cover",
              objectFit === "contain" && "object-contain",
              objectFit === "fill" && "object-fill",
              objectFit === "none" && "object-none",
              objectFit === "scale-down" && "object-scale-down",
              roundedClasses[rounded],
            )}
          />
        </motion.div>
      )}
    </div>
  )
}
