import { type NextRequest, NextResponse } from "next/server"

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next()

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' https:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  // Headers de sécurité
  response.headers.set("Content-Security-Policy", csp)
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // HSTS (HTTPS Strict Transport Security)
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

export function rateLimiter() {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (ip: string, limit = 100, windowMs = 60000) => {
    const now = Date.now()
    const userRequests = requests.get(ip)

    if (!userRequests || now > userRequests.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs })
      return { allowed: true, remaining: limit - 1 }
    }

    if (userRequests.count >= limit) {
      return { allowed: false, remaining: 0 }
    }

    userRequests.count++
    return { allowed: true, remaining: limit - userRequests.count }
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Supprimer les balises HTML
    .replace(/javascript:/gi, "") // Supprimer les liens JavaScript
    .replace(/on\w+=/gi, "") // Supprimer les gestionnaires d'événements
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule")
  }

  if (!/\d/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
