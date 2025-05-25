import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { securityHeaders, rateLimiter } from "@/lib/security/security-headers"

const limiter = rateLimiter()

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const userAgent = request.headers.get("user-agent") || ""

  // Log all requests for monitoring
  console.log(`[MIDDLEWARE] ${request.method} ${pathname}${search} - ${userAgent.slice(0, 50)}`)

  // Handle bot requests differently
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent)

  // Comprehensive redirect map with SEO considerations
  const redirectMap: Record<string, { target: string; permanent: boolean }> = {
    // English to French redirects (permanent for SEO)
    "/products": { target: "/catalogue", permanent: true },
    "/product": { target: "/catalogue", permanent: true },
    "/shop": { target: "/catalogue", permanent: true },
    "/store": { target: "/catalogue", permanent: true },
    "/items": { target: "/catalogue", permanent: true },
    "/categories": { target: "/catalogue", permanent: true },
    "/category": { target: "/catalogue", permanent: true },

    // Admin redirects (permanent)
    "/admin/products": { target: "/admin/produits", permanent: true },
    "/admin/orders": { target: "/admin/commandes", permanent: true },
    "/admin/users": { target: "/admin/utilisateurs", permanent: true },
    "/admin/settings": { target: "/admin/parametres", permanent: true },
    "/admin/stats": { target: "/admin/statistiques", permanent: true },
    "/admin/reports": { target: "/admin/rapports", permanent: true },
    "/admin/suppliers": { target: "/admin/fournisseurs", permanent: true },
    "/admin/analytics": { target: "/admin/analytique", permanent: true },
    "/admin/reviews": { target: "/admin/avis", permanent: true },
    "/admin/payments": { target: "/admin/paiements", permanent: true },
    "/admin/security": { target: "/admin/securite", permanent: true },
    "/admin/automation": { target: "/admin/automatisation", permanent: true },
    "/admin/profile": { target: "/admin/profil", permanent: true },
    "/admin/backups": { target: "/admin/sauvegardes", permanent: true },

    // Auth redirects (temporary for UX)
    "/login": { target: "/connexion", permanent: false },
    "/register": { target: "/inscription", permanent: false },
    "/signup": { target: "/inscription", permanent: false },
    "/signin": { target: "/connexion", permanent: false },
    "/logout": { target: "/deconnexion", permanent: false },
    "/signout": { target: "/deconnexion", permanent: false },

    // Shopping redirects (permanent for SEO)
    "/cart": { target: "/panier", permanent: true },
    "/basket": { target: "/panier", permanent: true },
    "/checkout": { target: "/paiement", permanent: true },
    "/payment": { target: "/paiement", permanent: true },
    "/order": { target: "/commandes", permanent: true },
    "/orders": { target: "/commandes", permanent: true },

    // Account redirects (permanent)
    "/account": { target: "/compte", permanent: true },
    "/profile": { target: "/compte", permanent: true },
    "/dashboard": { target: "/compte", permanent: true },
    "/my-account": { target: "/compte", permanent: true },

    // Content redirects (permanent for SEO)
    "/news": { target: "/nouveautes", permanent: true },
    "/new": { target: "/nouveautes", permanent: true },
    "/latest": { target: "/nouveautes", permanent: true },
    "/sales": { target: "/promotions", permanent: true },
    "/offers": { target: "/promotions", permanent: true },
    "/deals": { target: "/promotions", permanent: true },
    "/discounts": { target: "/promotions", permanent: true },
    "/about": { target: "/a-propos", permanent: true },
    "/about-us": { target: "/a-propos", permanent: true },
    "/contact-us": { target: "/contact", permanent: true },
    "/help": { target: "/faq", permanent: true },
    "/support": { target: "/faq", permanent: true },
    "/shipping": { target: "/livraison", permanent: true },
    "/delivery": { target: "/livraison", permanent: true },
    "/returns": { target: "/livraison", permanent: true },
    "/privacy": { target: "/confidentialite", permanent: true },
    "/privacy-policy": { target: "/confidentialite", permanent: true },
    "/terms": { target: "/conditions-generales", permanent: true },
    "/terms-of-service": { target: "/conditions-generales", permanent: true },
    "/legal": { target: "/mentions-legales", permanent: true },
    "/wishlist": { target: "/liste-souhaits", permanent: true },
    "/favorites": { target: "/liste-souhaits", permanent: true },
    "/brands": { target: "/marques", permanent: true },
    "/size-guide": { target: "/guide-tailles", permanent: true },
    "/security": { target: "/securite", permanent: true },
    "/history": { target: "/notre-histoire", permanent: true },
    "/careers": { target: "/carrieres", permanent: true },
    "/jobs": { target: "/carrieres", permanent: true },
    "/press": { target: "/presse", permanent: true },
    "/media": { target: "/presse", permanent: true },
    "/partners": { target: "/partenaires", permanent: true },
    "/payments": { target: "/paiements", permanent: true },

    // Legacy URLs (permanent redirects)
    "/index.html": { target: "/", permanent: true },
    "/home.html": { target: "/", permanent: true },
    "/index.php": { target: "/", permanent: true },
    "/home.php": { target: "/", permanent: true },
  }

  // Security headers
  const response = securityHeaders(request)

  // Rate limiting
  const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous"
  const { allowed, remaining } = limiter(ip)

  if (!allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Remaining": "0",
      },
    })
  }

  response.headers.set("X-RateLimit-Remaining", remaining.toString())

  // Check for exact redirects
  if (redirectMap[pathname]) {
    const { target, permanent } = redirectMap[pathname]
    const redirectUrl = new URL(target, request.url)
    if (search) redirectUrl.search = search

    const status = permanent ? 301 : 302
    console.log(`[REDIRECT ${status}] ${pathname} -> ${target}`)
    return NextResponse.redirect(redirectUrl, status)
  }

  // Handle dynamic category redirects
  const categoryMatch = pathname.match(/^\/category\/(.+)$/)
  if (categoryMatch) {
    const redirectUrl = new URL(`/catalogue/${categoryMatch[1]}`, request.url)
    if (search) redirectUrl.search = search
    console.log(`[CATEGORY REDIRECT] ${pathname} -> /catalogue/${categoryMatch[1]}`)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Handle product redirects
  const productMatch = pathname.match(/^\/product\/(.+)$/)
  if (productMatch) {
    const redirectUrl = new URL(`/produit/${productMatch[1]}`, request.url)
    if (search) redirectUrl.search = search
    console.log(`[PRODUCT REDIRECT] ${pathname} -> /produit/${productMatch[1]}`)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Handle old admin URLs
  const adminMatch = pathname.match(/^\/administration\/(.+)$/)
  if (adminMatch) {
    const redirectUrl = new URL(`/admin/${adminMatch[1]}`, request.url)
    if (search) redirectUrl.search = search
    console.log(`[ADMIN REDIRECT] ${pathname} -> /admin/${adminMatch[1]}`)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Handle trailing slashes (SEO best practice)
  if (pathname.endsWith("/") && pathname !== "/") {
    const redirectUrl = new URL(pathname.slice(0, -1), request.url)
    if (search) redirectUrl.search = search
    console.log(`[TRAILING SLASH] ${pathname} -> ${pathname.slice(0, -1)}`)
    return NextResponse.redirect(redirectUrl, 301)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
