"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface OptimizedSectionProps {
  children: ReactNode
  className?: string
  variant?: "default" | "compact" | "hero"
  background?: "default" | "muted" | "accent"
}

export function OptimizedSection({
  children,
  className,
  variant = "default",
  background = "default",
}: OptimizedSectionProps) {
  const variants = {
    default: "py-8 sm:py-12 md:py-16",
    compact: "py-4 sm:py-6 md:py-8",
    hero: "py-12 sm:py-16 md:py-24",
  }

  const backgrounds = {
    default: "bg-background",
    muted: "bg-muted/30",
    accent: "bg-accent/5",
  }

  return (
    <section className={cn("w-full", variants[variant], backgrounds[background], className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

interface OptimizedGridProps {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}

export function OptimizedGrid({ children, className, cols = 3, gap = "md" }: OptimizedGridProps) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  const gapClasses = {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
  }

  return <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>{children}</div>
}

interface OptimizedCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "compact" | "elevated"
  padding?: "sm" | "md" | "lg"
}

export function OptimizedCard({ children, className, variant = "default", padding = "md" }: OptimizedCardProps) {
  const variants = {
    default: "bg-card border border-border rounded-lg",
    compact: "bg-card border border-border rounded-md",
    elevated: "bg-card border border-border rounded-lg shadow-md",
  }

  const paddings = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  return <div className={cn(variants[variant], paddings[padding], className)}>{children}</div>
}
