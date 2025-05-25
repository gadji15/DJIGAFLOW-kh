import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatPrice, calculateDiscount } from "@/lib/utils"

// Fonction pour récupérer les nouveaux produits
async function getNewProducts() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(12)

  if (error) {
    console.error("Erreur lors de la récupération des nouveaux produits:", error)
    return []
  }

  return data
}

export default async function NewProductsPage() {
  const newProducts = (await getNewProducts()) || []

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10" />
            <div className="relative h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=1200"
                alt="Nouveautés"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container">
                <div className="max-w-lg space-y-4">
                  <h1 className="text-4xl font-bold">Nouveautés</h1>
                  <p className="text-lg">
                    Découvrez nos derniers produits tendance, fraîchement arrivés dans notre catalogue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Nos dernières arrivées</h2>

            {newProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <Link key={product.id} href={`/produit/${product.id}`} className="group">
                    <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          Nouveau
                        </div>
                        {product.sale_price && product.sale_price < product.price && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            -{calculateDiscount(product.price, product.sale_price)}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.sale_price ? (
                            <>
                              <span className="font-semibold">{formatPrice(product.sale_price)}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">Aucun nouveau produit disponible pour le moment.</p>
                <Button asChild>
                  <Link href="/catalogue">Voir tous nos produits</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/catalogue">Voir tout le catalogue</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
