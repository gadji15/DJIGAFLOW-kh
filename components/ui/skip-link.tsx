"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  className?: string
  label?: string
  targetId?: string
}

export function SkipLink({
  className,
  label = "Passer au contenu principal",
  targetId = "main-content",
}: SkipLinkProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.tabIndex = -1
      target.focus()
      setTimeout(() => {
        target.removeAttribute("tabindex")
      }, 1000)
    }
  }

  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:shadow-md",
        isFocused && "not-sr-only",
        className,
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleClick}
    >
      {label}
    </a>
  )
}
