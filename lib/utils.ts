import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction pour combiner les classes Tailwind de manière optimale
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formater les prix en euros
export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

// Générer un slug à partir d'un texte
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

// Tronquer un texte à une longueur donnée
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

// Calculer le pourcentage de réduction
export function calculateDiscount(originalPrice: number, salePrice: number) {
  if (!salePrice || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Formater les dates
export function formatDate(date: Date | string, locale = "fr-FR") {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

// Formater les dates avec l'heure
export function formatDateTime(date: Date | string, locale = "fr-FR") {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

// Formater les dates relatives (il y a X jours, etc.)
export function formatRelativeTime(date: Date | string, locale = "fr-FR") {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second")
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute")
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour")
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day")
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month")
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year")
  }
}
