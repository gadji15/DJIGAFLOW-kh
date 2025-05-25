// Utility to validate internal links
export const validateInternalLinks = () => {
  const validRoutes = [
    "/",
    "/catalogue",
    "/nouveautes",
    "/promotions",
    "/marques",
    "/panier",
    "/paiement",
    "/commande-confirmee",
    "/compte",
    "/connexion",
    "/inscription",
    "/a-propos",
    "/contact",
    "/faq",
    "/livraison",
    "/guide-tailles",
    "/securite",
    "/notre-histoire",
    "/carrieres",
    "/presse",
    "/partenaires",
    "/mentions-legales",
    "/conditions-generales",
    "/confidentialite",
    "/cookies",
    "/rgpd",
    "/liste-souhaits",
    "/commandes",
    "/paiements",
    "/chat",
    "/admin",
    "/admin/produits",
    "/admin/commandes",
    "/admin/utilisateurs",
    "/admin/statistiques",
    "/admin/rapports",
    "/admin/parametres",
    "/admin/fournisseurs",
    "/admin/analytique",
    "/admin/categories",
    "/admin/promotions",
    "/admin/marketing",
    "/admin/avis",
    "/admin/paiements",
    "/admin/securite",
    "/admin/database",
    "/admin/automatisation",
    "/admin/profil",
    "/admin/sauvegardes",
    "/produit/1",
    "/produit/2",
  ]

  const deprecatedRoutes = [
    "/products",
    "/product",
    "/shop",
    "/store",
    "/items",
    "/login",
    "/register",
    "/signup",
    "/signin",
    "/cart",
    "/basket",
    "/checkout",
    "/payment",
    "/account",
    "/profile",
    "/news",
    "/new",
    "/sales",
    "/offers",
    "/deals",
  ]

  return {
    validRoutes,
    deprecatedRoutes,
    isValidRoute: (path: string) => validRoutes.includes(path),
    isDeprecatedRoute: (path: string) => deprecatedRoutes.includes(path),
  }
}

// Advanced link validation system
export class LinkValidator {
  private validRoutes: Set<string>
  private brokenLinks: Map<string, string[]> = new Map()
  private checkedUrls: Set<string> = new Set()

  constructor() {
    const { validRoutes } = validateInternalLinks()
    this.validRoutes = new Set(validRoutes)
  }

  // Check if a URL is valid
  async validateUrl(url: string, context?: string): Promise<boolean> {
    if (this.checkedUrls.has(url)) {
      return !this.brokenLinks.has(url)
    }

    this.checkedUrls.add(url)

    try {
      // Internal link validation
      if (url.startsWith("/")) {
        const isValid = this.validRoutes.has(url) || this.isDynamicRoute(url)
        if (!isValid) {
          this.addBrokenLink(url, context)
        }
        return isValid
      }

      // External link validation
      if (url.startsWith("http")) {
        const response = await fetch(url, { method: "HEAD" })
        const isValid = response.ok
        if (!isValid) {
          this.addBrokenLink(url, context)
        }
        return isValid
      }

      return true
    } catch (error) {
      this.addBrokenLink(url, context, error.message)
      return false
    }
  }

  // Check if URL matches dynamic route patterns
  private isDynamicRoute(url: string): boolean {
    const dynamicPatterns = [/^\/produit\/\d+$/, /^\/catalogue\/[\w-]+$/, /^\/admin\/[\w-]+$/]

    return dynamicPatterns.some((pattern) => pattern.test(url))
  }

  // Add broken link to tracking
  private addBrokenLink(url: string, context?: string, error?: string) {
    if (!this.brokenLinks.has(url)) {
      this.brokenLinks.set(url, [])
    }

    const contextInfo = context ? `Context: ${context}` : "Unknown context"
    const errorInfo = error ? `Error: ${error}` : ""
    this.brokenLinks.get(url)!.push(`${contextInfo} ${errorInfo}`.trim())
  }

  // Get all broken links
  getBrokenLinks(): Map<string, string[]> {
    return this.brokenLinks
  }

  // Generate report
  generateReport(): string {
    if (this.brokenLinks.size === 0) {
      return "✅ No broken links found!"
    }

    let report = `🚨 Found ${this.brokenLinks.size} broken links:\n\n`

    for (const [url, contexts] of this.brokenLinks) {
      report += `❌ ${url}\n`
      contexts.forEach((context) => {
        report += `   - ${context}\n`
      })
      report += "\n"
    }

    return report
  }

  // Clear cache
  clearCache() {
    this.checkedUrls.clear()
    this.brokenLinks.clear()
  }
}

// Link validation component
export const linkValidation = {
  // Admin routes
  admin: {
    dashboard: "/admin",
    products: "/admin/produits",
    orders: "/admin/commandes",
    users: "/admin/utilisateurs",
    statistics: "/admin/statistiques",
    reports: "/admin/rapports",
    settings: "/admin/parametres",
    suppliers: "/admin/fournisseurs",
    analytics: "/admin/analytique",
    categories: "/admin/categories",
    promotions: "/admin/promotions",
    marketing: "/admin/marketing",
    reviews: "/admin/avis",
    payments: "/admin/paiements",
    security: "/admin/securite",
    database: "/admin/database",
    automation: "/admin/automatisation",
    profile: "/admin/profil",
    backups: "/admin/sauvegardes",
  },

  // Public routes
  public: {
    home: "/",
    catalog: "/catalogue",
    news: "/nouveautes",
    promotions: "/promotions",
    brands: "/marques",
    cart: "/panier",
    checkout: "/paiement",
    orderConfirmed: "/commande-confirmee",
    account: "/compte",
    login: "/connexion",
    register: "/inscription",
    about: "/a-propos",
    contact: "/contact",
    faq: "/faq",
    shipping: "/livraison",
    sizeGuide: "/guide-tailles",
    security: "/securite",
    history: "/notre-histoire",
    careers: "/carrieres",
    press: "/presse",
    partners: "/partenaires",
    legal: "/mentions-legales",
    terms: "/conditions-generales",
    privacy: "/confidentialite",
    cookies: "/cookies",
    gdpr: "/rgpd",
    wishlist: "/liste-souhaits",
    orders: "/commandes",
    payments: "/paiements",
    chat: "/chat",
  },

  // Dynamic routes
  dynamic: {
    product: (id: string) => `/produit/${id}`,
    category: (id: string) => `/catalogue/${id}`,
    brand: (name: string) => `/marques/${name}`,
  },
}

// Automated link checking service
export class AutomatedLinkChecker {
  private validator: LinkValidator
  private checkInterval: number = 24 * 60 * 60 * 1000 // 24 hours

  constructor() {
    this.validator = new LinkValidator()
  }

  // Start automated checking
  startAutomatedChecking() {
    this.runCheck()
    setInterval(() => {
      this.runCheck()
    }, this.checkInterval)
  }

  // Run comprehensive link check
  private async runCheck() {
    console.log("🔍 Starting automated link check...")

    try {
      // Check all static routes
      const { validRoutes } = validateInternalLinks()

      for (const route of validRoutes) {
        await this.validator.validateUrl(route, "Static route check")
      }

      // Check external links (sample)
      const externalLinks = [
        "https://facebook.com/djigaflow",
        "https://instagram.com/djigaflow",
        "https://twitter.com/djigaflow",
      ]

      for (const link of externalLinks) {
        await this.validator.validateUrl(link, "External link check")
      }

      // Generate and log report
      const report = this.validator.generateReport()
      console.log(report)

      // Send notification if broken links found
      if (this.validator.getBrokenLinks().size > 0) {
        await this.notifyBrokenLinks(report)
      }
    } catch (error) {
      console.error("❌ Link check failed:", error)
    }
  }

  // Notify about broken links
  private async notifyBrokenLinks(report: string) {
    // In a real implementation, this would send notifications
    // via email, Slack, or other channels
    console.warn("🚨 BROKEN LINKS DETECTED:")
    console.warn(report)

    // Could also save to database for admin dashboard
    try {
      await fetch("/api/admin/broken-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report, timestamp: new Date().toISOString() }),
      })
    } catch (error) {
      console.error("Failed to save broken links report:", error)
    }
  }

  // Manual check trigger
  async runManualCheck(): Promise<string> {
    await this.runCheck()
    return this.validator.generateReport()
  }

  // Get current status
  getStatus() {
    return {
      brokenLinksCount: this.validator.getBrokenLinks().size,
      lastCheck: new Date().toISOString(),
      brokenLinks: Array.from(this.validator.getBrokenLinks().keys()),
    }
  }
}
