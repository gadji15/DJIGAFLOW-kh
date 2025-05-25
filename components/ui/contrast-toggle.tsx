"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContrastToggleProps {
  className?: string
}

export function ContrastToggle({ className }: ContrastToggleProps) {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Check if user has high contrast preference
    const savedPreference = localStorage.getItem("high-contrast")
    if (savedPreference === "true") {
      setHighContrast(true)
      document.documentElement.classList.add("high-contrast")
    }
  }, [])

  const toggleContrast = () => {
    setHighContrast(!highContrast)
    if (!highContrast) {
      document.documentElement.classList.add("high-contrast")
      localStorage.setItem("high-contrast", "true")
    } else {
      document.documentElement.classList.remove("high-contrast")
      localStorage.setItem("high-contrast", "false")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleContrast}
      aria-label={highContrast ? "Désactiver le contraste élevé" : "Activer le contraste élevé"}
      title={highContrast ? "Désactiver le contraste élevé" : "Activer le contraste élevé"}
      className={cn("relative", className)}
    >
      {highContrast ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}
