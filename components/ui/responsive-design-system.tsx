"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import type { JSX } from "react/jsx-runtime"

// ===== RESPONSIVE CONTAINER SYSTEM =====
const containerVariants = cva("mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16", {
  variants: {
    size: {
      xs: "max-w-screen-xs",
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      "3xl": "max-w-[1600px]",
      "4xl": "max-w-[1920px]",
      full: "max-w-full",
      fluid: "w-full",
    },
    spacing: {
      none: "py-0",
      xs: "py-2 sm:py-4",
      sm: "py-4 sm:py-6 lg:py-8",
      md: "py-6 sm:py-8 lg:py-12 xl:py-16",
      lg: "py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24",
      xl: "py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32",
      "2xl": "py-16 sm:py-20 lg:py-24 xl:py-32 2xl:py-40",
    },
  },
  defaultVariants: {
    size: "2xl",
    spacing: "md",
  },
})

interface ResponsiveContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  id?: string
}

export function ResponsiveContainer({
  size,
  spacing,
  children,
  className,
  as: Component = "div",
  id,
}: ResponsiveContainerProps) {
  return (
    <Component id={id} className={cn(containerVariants({ size, spacing }), className)}>
      {children}
    </Component>
  )
}

// ===== RESPONSIVE GRID SYSTEM =====
const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
      "auto-sm": "grid-cols-[repeat(auto-fit,minmax(240px,1fr))]",
      "auto-lg": "grid-cols-[repeat(auto-fit,minmax(320px,1fr))]",
    },
    gap: {
      none: "gap-0",
      xs: "gap-2 sm:gap-3",
      sm: "gap-3 sm:gap-4 lg:gap-5",
      md: "gap-4 sm:gap-5 lg:gap-6 xl:gap-8",
      lg: "gap-5 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12",
      xl: "gap-6 sm:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "md",
    align: "stretch",
  },
})

interface ResponsiveGridProps extends VariantProps<typeof gridVariants> {
  children: ReactNode
  className?: string
}

export function ResponsiveGrid({ cols, gap, align, children, className }: ResponsiveGridProps) {
  return <div className={cn(gridVariants({ cols, gap, align }), className)}>{children}</div>
}

// ===== RESPONSIVE TYPOGRAPHY =====
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight",
      h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight",
      h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight",
      h4: "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold",
      h5: "text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium",
      h6: "text-sm sm:text-base md:text-lg lg:text-xl font-medium",
      body: "text-sm sm:text-base lg:text-lg leading-relaxed",
      "body-sm": "text-xs sm:text-sm md:text-base leading-relaxed",
      "body-lg": "text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed",
      caption: "text-xs sm:text-sm text-muted-foreground",
      overline: "text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      destructive: "text-destructive",
      gradient: "bg-gradient-to-r from-primary via-primary-hover to-secondary bg-clip-text text-transparent",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    align: "left",
  },
})

interface ResponsiveTypographyProps extends VariantProps<typeof typographyVariants> {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function ResponsiveTypography({ variant, color, align, children, className, as }: ResponsiveTypographyProps) {
  const Component = as || (variant?.startsWith("h") ? (variant as keyof JSX.IntrinsicElements) : "p")

  return <Component className={cn(typographyVariants({ variant, color, align }), className)}>{children}</Component>
}

// ===== RESPONSIVE CARD SYSTEM =====
const cardVariants = cva("bg-card text-card-foreground rounded-xl border shadow-sm transition-all duration-300", {
  variants: {
    size: {
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6 lg:p-8",
      lg: "p-6 sm:p-8 lg:p-10 xl:p-12",
      xl: "p-8 sm:p-10 lg:p-12 xl:p-16",
    },
    hover: {
      none: "",
      lift: "hover:shadow-lg hover:-translate-y-1",
      glow: "hover:shadow-colored hover:border-primary/20",
      scale: "hover:scale-[1.02]",
      all: "hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/20",
    },
    variant: {
      default: "border-border",
      elevated: "shadow-md border-border/50",
      outlined: "border-2 border-border",
      filled: "bg-muted border-transparent",
      gradient: "bg-gradient-to-br from-card to-muted border-border/50",
    },
  },
  defaultVariants: {
    size: "md",
    hover: "lift",
    variant: "default",
  },
})

interface ResponsiveCardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function ResponsiveCard({ size, hover, variant, children, className, onClick }: ResponsiveCardProps) {
  const Component = onClick ? motion.div : "div"

  return (
    <Component
      className={cn(cardVariants({ size, hover, variant }), className)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  )
}

// ===== RESPONSIVE FLEX SYSTEM =====
const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      col: "flex-col",
      "col-reverse": "flex-col-reverse",
      "responsive-row": "flex-col sm:flex-row",
      "responsive-col": "flex-row sm:flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1 sm:gap-2",
      sm: "gap-2 sm:gap-3 lg:gap-4",
      md: "gap-3 sm:gap-4 lg:gap-6",
      lg: "gap-4 sm:gap-6 lg:gap-8",
      xl: "gap-6 sm:gap-8 lg:gap-10",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "start",
    justify: "start",
    wrap: "nowrap",
    gap: "none",
  },
})

interface ResponsiveFlexProps extends VariantProps<typeof flexVariants> {
  children: ReactNode
  className?: string
}

export function ResponsiveFlex({ direction, align, justify, wrap, gap, children, className }: ResponsiveFlexProps) {
  return <div className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}>{children}</div>
}

// ===== RESPONSIVE IMAGE COMPONENT =====
interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto"
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export function ResponsiveImage({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  aspectRatio = "auto",
  objectFit = "cover",
}: ResponsiveImageProps) {
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "",
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", aspectRatioClasses[aspectRatio], className)}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        sizes={sizes}
        className={cn(
          "w-full h-full transition-transform duration-300 hover:scale-105",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down",
        )}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

// ===== RESPONSIVE BUTTON SYSTEM =====
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-colored",
      },
      size: {
        xs: "h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm",
        sm: "h-8 px-3 text-sm sm:h-9 sm:px-4",
        md: "h-9 px-4 text-sm sm:h-10 sm:px-6 sm:text-base",
        lg: "h-10 px-6 text-base sm:h-11 sm:px-8 sm:text-lg",
        xl: "h-11 px-8 text-lg sm:h-12 sm:px-10 sm:text-xl",
        icon: "h-9 w-9 sm:h-10 sm:w-10",
        "icon-sm": "h-7 w-7 sm:h-8 sm:w-8",
        "icon-lg": "h-11 w-11 sm:h-12 sm:w-12",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  },
)

interface ResponsiveButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function ResponsiveButton({
  variant,
  size,
  fullWidth,
  children,
  className,
  onClick,
  disabled,
  type = "button",
}: ResponsiveButtonProps) {
  return (
    <motion.button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
}
