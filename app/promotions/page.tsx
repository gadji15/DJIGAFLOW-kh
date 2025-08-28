
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatPrice, calculateDiscount } from "@/lib/utils"

// Fonction pour récupérer les produits en promotion
async function getPromotionProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("sale_price", "is", null)
    .order("sale_price", { ascending: true })
    .limit(12)

  if (error) {
    console.error("Erreur lors de la récupération des produits en promotion:", error)
    return []
  }

  return data
}

export default async function PromotionsPage() {
  const promotionProducts = await getPromotionProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8">
        <div className="container">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent z-10" />
            <div className="relative h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=1200"
                alt="Promotions"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container">
                <div className="max-w-lg space-y-4">
                  <h1 className="text-4xl font-bold">Promotions</h1>
                  <p className="text-lg">
                    Profitez de nos offres spéciales et réductions exceptionnelles sur une sélection de produits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Offres spéciales</h2>

            {promotionProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {promotionProducts.map((product) => (
                  <Link key={product.id} href={`/produit/${product.id}`} className="group">
                    <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{calculateDiscount(product.price, product.sale_price)}%
                        </div>
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
                          <span className="font-semibold">{formatPrice(product.sale_price)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground mb-4">Aucun produit en promotion disponible pour le moment.</p>
                <Button asChild>
                  <Link href="/catalogue">Voir tous nos produits</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-10" />
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Promotion été"
                width={600}
                height={300}
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Collection Été</h3>
                <p className="text-white/90 mb-4">Jusqu'à 40% de réduction sur une sélection d'articles</p>
                <Button asChild className="w-fit">
                  <Link href="/promotions/ete">Découvrir</Link>
                </Button>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-10" />
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Déstockage"
                width={600}
                height={300}
                className="w-full h-[300px] object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Déstockage</h3>
                <p className="text-white/90 mb-4">Jusqu'à 70% de réduction sur les derniers stocks</p>
                <Button asChild className="w-fit">
                  <Link href="/promotions/destockage">Voir les offres</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/catalogue">Voir tout le catalogue</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
