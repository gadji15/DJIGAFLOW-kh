"use client"

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

interface UserProperties {
  userId?: string
  email?: string
  name?: string
  plan?: string
  signupDate?: string
  lastActive?: string
}

class AnalyticsService {
  private sessionId: string
  private userId?: string
  private queue: AnalyticsEvent[] = []
  private isOnline = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeService()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeService() {
    // Détecter le statut de connexion
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine

      window.addEventListener("online", () => {
        this.isOnline = true
        this.flushQueue()
      })

      window.addEventListener("offline", () => {
        this.isOnline = false
      })

      // Vider la queue avant de quitter la page
      window.addEventListener("beforeunload", () => {
        this.flushQueue()
      })

      // Traitement périodique de la queue
      setInterval(() => {
        if (this.isOnline && this.queue.length > 0) {
          this.flushQueue()
        }
      }, 5000)
    }
  }

  // Identifier un utilisateur
  identify(userId: string, properties?: UserProperties) {
    this.userId = userId
    this.track("user_identified", {
      userId,
      ...properties,
      sessionId: this.sessionId,
    })
  }

  // Suivre un événement
  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: typeof window !== "undefined" ? window.location.href : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    }

    this.queue.push(event)

    // Envoyer immédiatement si en ligne et queue pas trop grande
    if (this.isOnline && this.queue.length >= 10) {
      this.flushQueue()
    }
  }

  // Suivre une page vue
  page(pageName?: string, properties?: Record<string, any>) {
    this.track("page_view", {
      page: pageName || (typeof window !== "undefined" ? window.location.pathname : ""),
      title: typeof document !== "undefined" ? document.title : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      ...properties,
    })
  }

  // Suivre un événement e-commerce
  ecommerce(action: string, properties: Record<string, any>) {
    this.track(`ecommerce_${action}`, {
      ...properties,
      category: "ecommerce",
    })
  }

  // Suivre les performances
  performance(metric: string, value: number, properties?: Record<string, any>) {
    this.track("performance_metric", {
      metric,
      value,
      ...properties,
      category: "performance",
    })
  }

  // Suivre les erreurs
  error(error: Error, context?: Record<string, any>) {
    this.track("error", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
      category: "error",
    })
  }

  // Vider la queue d'événements
  private async flushQueue() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
        keepalive: true,
      })
    } catch (error) {
      // Remettre les événements dans la queue en cas d'erreur
      this.queue.unshift(...events)
      console.error("Failed to send analytics events:", error)
    }
  }

  // Méthodes spécifiques pour l'e-commerce
  trackPurchase(orderId: string, products: any[], total: number) {
    this.ecommerce("purchase", {
      orderId,
      products,
      total,
      currency: "EUR",
    })
  }

  trackAddToCart(product: any) {
    this.ecommerce("add_to_cart", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
    })
  }

  trackRemoveFromCart(product: any) {
    this.ecommerce("remove_from_cart", {
      productId: product.id,
      productName: product.name,
      price: product.price,
    })
  }

  trackProductView(product: any) {
    this.ecommerce("product_view", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
    })
  }

  trackSearch(query: string, results: number) {
    this.track("search", {
      query,
      results,
      category: "search",
    })
  }

  // Mesurer les Core Web Vitals
  measureWebVitals() {
    if (typeof window === "undefined") return

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.performance("lcp", lastEntry.startTime)
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.performance("fid", entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.performance("cls", clsValue)
    }).observe({ entryTypes: ["layout-shift"] })
  }
}

// Instance globale
export const analytics = new AnalyticsService()

// Hook React pour utiliser les analytics
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    analytics.page(pathname)
  }, [pathname])

  useEffect(() => {
    analytics.measureWebVitals()
  }, [])

  return analytics
}
