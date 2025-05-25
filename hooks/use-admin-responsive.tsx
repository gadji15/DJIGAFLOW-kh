"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "./use-media-query"

interface AdminResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  sidebarCollapsed: boolean
  showMobileNav: boolean
  orientation: "portrait" | "landscape"
}

export function useAdminResponsive() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")
  const isLandscape = useMediaQuery("(orientation: landscape)")

  const [state, setState] = useState<AdminResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    sidebarCollapsed: false,
    showMobileNav: false,
    orientation: "portrait",
  })

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isMobile,
      isTablet,
      isDesktop,
      orientation: isLandscape ? "landscape" : "portrait",
      showMobileNav: isMobile,
      sidebarCollapsed: isMobile || isTablet,
    }))
  }, [isMobile, isTablet, isDesktop, isLandscape])

  const toggleSidebar = () => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }))
  }

  const closeSidebar = () => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: true,
    }))
  }

  const openSidebar = () => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: false,
    }))
  }

  return {
    ...state,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    // Utility functions
    getContainerClass: () => {
      if (isMobile) return "px-4 py-4"
      if (isTablet) return "px-6 py-6"
      return "px-8 py-8"
    },
    getGridCols: (base: number) => {
      if (isMobile) return Math.min(base, 1)
      if (isTablet) return Math.min(base, 2)
      return base
    },
    shouldShowCompactView: () => isMobile || (isTablet && isLandscape),
    getCardSpacing: () => (isMobile ? "gap-4" : "gap-6"),
  }
}

// Hook pour la gestion des breakpoints spécifiques à l'admin
export function useAdminBreakpoints() {
  const isXs = useMediaQuery("(max-width: 475px)")
  const isSm = useMediaQuery("(min-width: 476px) and (max-width: 640px)")
  const isMd = useMediaQuery("(min-width: 641px) and (max-width: 768px)")
  const isLg = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")
  const isXl = useMediaQuery("(min-width: 1025px) and (max-width: 1280px)")
  const is2Xl = useMediaQuery("(min-width: 1281px)")

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    current: isXs ? "xs" : isSm ? "sm" : isMd ? "md" : isLg ? "lg" : isXl ? "xl" : "2xl",
  }
}
