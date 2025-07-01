"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { adminLogger } from "@/lib/admin-logger"

export function useLoggedNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const previousPath = useRef<string>("")

  // Log navigation changes
  useEffect(() => {
    if (previousPath.current && previousPath.current !== pathname) {
      adminLogger.logNavigation(previousPath.current, pathname, "programmatic")
    }
    previousPath.current = pathname
  }, [pathname])

  const navigateWithLogging = async (href: string, method: "push" | "replace" = "push") => {
    try {
      await adminLogger.logNavigation(pathname, href, "click")

      if (method === "push") {
        router.push(href)
      } else {
        router.replace(href)
      }
    } catch (error) {
      await adminLogger.error(
        "NAVIGATION",
        "navigation_error",
        `Navigation failed from ${pathname} to ${href}`,
        { from: pathname, to: href, method },
        error instanceof Error ? error : new Error(String(error)),
      )
      throw error
    }
  }

  return {
    navigate: navigateWithLogging,
    currentPath: pathname,
  }
}
