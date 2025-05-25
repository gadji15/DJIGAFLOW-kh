"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    "2xl"?: number
  }
  gap?: {
    x?: number
    y?: number
  }
  autoFit?: boolean
  minChildWidth?: string
  maxChildWidth?: string
}

export function ResponsiveGrid({
  children,
  className,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
    "2xl": 4,
  },
  gap = {
    x: 6,
    y: 6,
  },
  autoFit = false,
  minChildWidth = "250px",
  maxChildWidth = "1fr",
}: ResponsiveGridProps) {
  // If autoFit is true, use grid-template-columns: repeat(auto-fit, minmax(minChildWidth, maxChildWidth))
  if (autoFit) {
    return (
      <div
        className={cn("grid", className)}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${minChildWidth}, ${maxChildWidth}))`,
          gap: `${gap.y ? gap.y * 0.25 : 0}rem ${gap.x ? gap.x * 0.25 : 0}rem`,
        }}
      >
        {children}
      </div>
    )
  }

  // Otherwise, use responsive columns based on breakpoints
  const gridColsClasses = [
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    columns["2xl"] && `2xl:grid-cols-${columns["2xl"]}`,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={cn("grid", gridColsClasses, gap.x && `gap-x-${gap.x}`, gap.y && `gap-y-${gap.y}`, className)}>
      {children}
    </div>
  )
}
