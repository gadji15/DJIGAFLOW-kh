import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  // Common redirects for broken links
  const redirectMap: Record<string, string> = {
    "/products": "/catalogue",
    "/product": "/catalogue",
    "/shop": "/catalogue",
    "/store": "/catalogue",
    "/items": "/catalogue",
    "/admin/products": "/admin/produits",
    "/admin/orders": "/admin/commandes",
    "/admin/users": "/admin/utilisateurs",
    "/admin/settings": "/admin/parametres",
    "/admin/stats": "/admin/statistiques",
    "/admin/reports": "/admin/rapports",
    "/login": "/connexion",
    "/register": "/inscription",
    "/signup": "/inscription",
    "/signin": "/connexion",
    "/cart": "/panier",
    "/basket": "/panier",
    "/checkout": "/paiement",
    "/payment": "/paiement",
    "/account": "/compte",
    "/profile": "/compte",
    "/news": "/nouveautes",
    "/new": "/nouveautes",
    "/sales": "/promotions",
    "/offers": "/promotions",
    "/deals": "/promotions",
  }

  if (path && redirectMap[path]) {
    return NextResponse.redirect(new URL(redirectMap[path], request.url))
  }

  // If no redirect found, return 404
  return new NextResponse("Not Found", { status: 404 })
}
