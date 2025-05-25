"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function SkipLink() {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && e.shiftKey) {
        setIsFocused(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <a
      href="#main-content"
      className={cn(
        "fixed top-0 left-0 z-[100] bg-primary text-primary-foreground px-4 py-3 transform -translate-y-full focus:translate-y-0 transition-transform duration-200",
        isFocused && "translate-y-0",
      )}
      onBlur={() => setIsFocused(false)}
    >
      Aller au contenu principal
    </a>
  )
}
