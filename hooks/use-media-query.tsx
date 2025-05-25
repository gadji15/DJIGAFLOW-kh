"use client"

import { useState, useEffect } from "react"

type MediaQueryOptions = {
  defaultValue?: boolean
}

export function useMediaQuery(query: string, options: MediaQueryOptions = {}): boolean {
  const { defaultValue = false } = options
  const [matches, setMatches] = useState(defaultValue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Set initial value
      setMatches(media.matches)

      // Define callback for media query change
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Add listener
      media.addEventListener("change", listener)

      // Clean up
      return () => {
        media.removeEventListener("change", listener)
      }
    }
  }, [query])

  // Return defaultValue during SSR to avoid hydration mismatch
  return mounted ? matches : defaultValue
}

// Predefined media query hooks
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)")
}

export function useIsLargeDesktop() {
  return useMediaQuery("(min-width: 1280px)")
}

export function useIsDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)")
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}

export function useIsPortrait() {
  return useMediaQuery("(orientation: portrait)")
}

export function useIsLandscape() {
  return useMediaQuery("(orientation: landscape)")
}
