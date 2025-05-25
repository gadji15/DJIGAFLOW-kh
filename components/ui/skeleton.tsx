import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "rectangular" | "circular" | "text" | "card"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({ className, variant = "rectangular", width, height, animation = "pulse" }: SkeletonProps) {
  const baseStyles = "bg-muted/60"
  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  }

  const variantStyles = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "h-4 rounded w-2/3",
    card: "rounded-lg",
  }

  const styles = cn(baseStyles, animationStyles[animation], variantStyles[variant], className)

  const inlineStyles = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  }

  return <div className={styles} style={inlineStyles} aria-hidden="true" />
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 && lines > 1 ? "40%" : "100%"} className="h-4" />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton variant="rectangular" className="h-48 w-full" />
      <SkeletonText lines={2} />
      <div className="flex justify-between">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={50} />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return <Skeleton variant="circular" className={cn(sizeMap[size], className)} />
}
