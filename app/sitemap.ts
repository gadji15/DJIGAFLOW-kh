import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://djigaflow.com"
  const currentDate = new Date()

  // Main pages
  const mainPages = [
    { url: "", priority: 1.0, changeFreq: "daily" as const },
    { url: "/catalogue", priority: 0.9, changeFreq: "daily" as const },
    { url: "/nouveautes", priority: 0.8, changeFreq: "daily" as const },
    { url: "/promotions", priority: 0.8, changeFreq: "daily" as const },
    { url: "/marques", priority: 0.7, changeFreq: "weekly" as const },
  ]

  // Info pages
  const infoPages = [
    { url: "/a-propos", priority: 0.6, changeFreq: "monthly" as const },
    { url: "/contact", priority: 0.7, changeFreq: "monthly" as const },
    { url: "/faq", priority: 0.6, changeFreq: "monthly" as const },
    { url: "/livraison", priority: 0.6, changeFreq: "monthly" as const },
    { url: "/guide-tailles", priority: 0.5, changeFreq: "monthly" as const },
    { url: "/securite", priority: 0.5, changeFreq: "monthly" as const },
    { url: "/notre-histoire", priority: 0.4, changeFreq: "yearly" as const },
    { url: "/carrieres", priority: 0.5, changeFreq: "monthly" as const },
    { url: "/presse", priority: 0.4, changeFreq: "monthly" as const },
    { url: "/partenaires", priority: 0.4, changeFreq: "monthly" as const },
  ]

  // Legal pages
  const legalPages = [
    { url: "/mentions-legales", priority: 0.3, changeFreq: "yearly" as const },
    { url: "/confidentialite", priority: 0.3, changeFreq: "yearly" as const },
    { url: "/conditions-generales", priority: 0.3, changeFreq: "yearly" as const },
    { url: "/cookies", priority: 0.3, changeFreq: "yearly" as const },
    { url: "/rgpd", priority: 0.3, changeFreq: "yearly" as const },
  ]

  // User pages
  const userPages = [
    { url: "/connexion", priority: 0.5, changeFreq: "monthly" as const },
    { url: "/inscription", priority: 0.5, changeFreq: "monthly" as const },
    { url: "/compte", priority: 0.6, changeFreq: "weekly" as const },
    { url: "/commandes", priority: 0.6, changeFreq: "weekly" as const },
    { url: "/liste-souhaits", priority: 0.5, changeFreq: "weekly" as const },
    { url: "/panier", priority: 0.7, changeFreq: "daily" as const },
    { url: "/paiement", priority: 0.7, changeFreq: "monthly" as const },
    { url: "/paiements", priority: 0.5, changeFreq: "monthly" as const },
  ]

  // Category pages
  const categories = ["electronique", "mode", "maison", "sport", "beaute", "auto"]
  const categoryPages = categories.map((category) => ({
    url: `/catalogue/${category}`,
    priority: 0.8,
    changeFreq: "daily" as const,
  }))

  // Product pages (example)
  const productPages = Array.from({ length: 10 }, (_, i) => ({
    url: `/produit/${i + 1}`,
    priority: 0.7,
    changeFreq: "weekly" as const,
  }))

  const allPages = [...mainPages, ...infoPages, ...legalPages, ...userPages, ...categoryPages, ...productPages]

  return allPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: currentDate,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }))
}
