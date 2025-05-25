import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  homeIcon?: boolean
  separator?: React.ReactNode
  maxItems?: number
}

export function Breadcrumb({
  items,
  className,
  homeIcon = true,
  separator = <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" aria-hidden="true" />,
  maxItems = 0,
}: BreadcrumbProps) {
  // Handle truncation if maxItems is specified
  let displayItems = items
  if (maxItems > 0 && items.length > maxItems) {
    const firstItems = items.slice(0, Math.max(1, Math.floor((maxItems - 1) / 2)))
    const lastItems = items.slice(-Math.ceil((maxItems - 1) / 2))

    displayItems = [...firstItems, { label: "...", href: "#", isCurrent: false }, ...lastItems]
  }

  return (
    <nav aria-label="Fil d'Ariane" className={cn("flex text-sm", className)}>
      <ol className="flex items-center flex-wrap">
        {homeIcon && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center"
              aria-label="Accueil"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
        )}

        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {(index > 0 || homeIcon) && separator}
            {item.isCurrent ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
