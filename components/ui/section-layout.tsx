import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
}

export function SectionHeader({ title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={cn("mb-8 md:mb-12", align === "center" && "text-center", align === "right" && "text-right", className)}
    >
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-3">{title}</h2>
      {subtitle && <p className="text-muted-foreground max-w-[85ch] mx-auto">{subtitle}</p>}
    </div>
  )
}

interface SectionLayoutProps {
  children: ReactNode
  className?: string
  id?: string
  background?: "default" | "muted" | "primary" | "primary-light" | "accent" | "accent-light"
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  spacing?: "none" | "sm" | "md" | "lg" | "xl"
}

export function SectionLayout({
  children,
  className,
  id,
  background = "default",
  containerSize = "2xl",
  spacing = "lg",
}: SectionLayoutProps) {
  const bgClasses = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    "primary-light": "bg-primary/5",
    accent: "bg-accent text-accent-foreground",
    "accent-light": "bg-accent/5",
  }

  const spacingClasses = {
    none: "py-0",
    sm: "py-8",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
    xl: "py-24 md:py-32",
  }

  const containerClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  }

  return (
    <section id={id} className={cn(bgClasses[background], spacingClasses[spacing], className)}>
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", containerClasses[containerSize])}>{children}</div>
    </section>
  )
}
