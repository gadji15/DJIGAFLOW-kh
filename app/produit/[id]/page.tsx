
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, Heart, Share2, Truck, ShieldCheck, RotateCcw } from "lucide-react"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { notFound } from "next/navigation"

// Remove the OptimizedImage import and use regular Image
// Remove the Breadcrumb import and create a simple breadcrumb
// Remove the LazySection import and use regular div

// Simple breadcrumb component
function SimpleBreadcrumb({ items }: { items: Array<{ label: string; href: string; isCurrent?: boolean }> }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
            {item.isCurrent ? (
              <span className="text-muted-foreground">{item.label}</span>
            ) : (
              <Link href={item.href} className="text-primary hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Données statiques pour la démo
const getProduct = (id: string) => {
  const products = [
    {
      id: "1",
      name: "Smartphone XYZ",
      description: "Un smartphone puissant avec un excellent appareil photo et une batterie longue durée.",
      price: 499.99,
      sale_price: 449.99,
      stock: 50,
      category_id: "electronics",
      images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
      rating: 4.5,
      reviews_count: 120,
      specifications: {
        Écran: "6.5 pouces OLED",
        Processeur: "Snapdragon 888",
        Mémoire: "128 Go",
        Batterie: "4500 mAh",
      },
      categories: { name: "Électronique" },
    },
    {
      id: "2",
      name: "Casque Audio Pro",
      description: "Casque audio professionnel avec réduction de bruit active.",
      price: 299.99,
      sale_price: null,
      stock: 25,
      category_id: "audio",
      images: ["/placeholder.svg?height=600&width=600"],
      rating: 4.8,
      reviews_count: 89,
      specifications: {
        Type: "Circum-auriculaire",
        Connectivité: "Bluetooth 5.0",
        Autonomie: "30 heures",
        Réduction: "Bruit actif",
      },
      categories: { name: "Audio" },
    },
  ]

  return products.find((p) => p.id === id) || null
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id)

  if (!product) {
    notFound()
  }

  const averageRating = product.rating
  const discount = product.sale_price ? calculateDiscount(product.price, product.sale_price) : 0

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-12">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Fil d'Ariane - Improved spacing */}
          <SimpleBreadcrumb
            items={[
              { label: "Catalogue", href: "/catalogue" },
              { label: product.categories?.name || "Catégorie", href: `/catalogue/${product.category_id}` },
              { label: product.name, href: `/produit/${params.id}`, isCurrent: true },
            ]}
          />
          <div className="mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-2">
            {/* Galerie d'images - Improved spacing */}
            <div className="space-y-6">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-medium">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
                {product.sale_price && product.sale_price < product.price && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white font-semibold px-4 py-2 rounded-md">
                    -{discount}%
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-6">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden shadow-soft">
                    <Image
                      src={image || "/placeholder.svg?height=150&width=150"}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rest of the component remains the same... */}
            <div className="lg:pl-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({product.reviews_count} avis)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-price">{formatPrice(product.sale_price)}</span>
                    <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>

              <div className="mb-8">
                <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

                <div className="flex items-center text-sm text-green-600 mb-6 bg-green-50 p-3 rounded-md">
                  <div className="w-3 h-3 rounded-full bg-green-600 mr-3"></div>
                  <span>En stock - {product.stock} unités disponibles</span>
                </div>
              </div>

              {/* Sélecteur de quantité et ajout au panier - Improved spacing */}
              <div className="flex flex-col sm:flex-row gap-5 mb-8">
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="rounded-none h-12 w-12">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center text-lg">1</span>
                  <Button variant="ghost" size="icon" className="rounded-none h-12 w-12">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <AddToCartButton product={product} />
                </div>

                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Avantages - Improved spacing */}
              <div className="space-y-5 border-t pt-8">
                <div className="flex items-start gap-4">
                  <Truck className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base">Livraison rapide</h4>
                    <p className="text-sm text-muted-foreground">Livraison en 3-5 jours ouvrés</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base">Garantie satisfaction</h4>
                    <p className="text-sm text-muted-foreground">30 jours satisfait ou remboursé</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <RotateCcw className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base">Retours gratuits</h4>
                    <p className="text-sm text-muted-foreground">Retours sans frais sous 30 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets d'information - Improved spacing */}
          <div className="px-2">
            <div className="animate-slide-up">
              <Tabs defaultValue="description" className="mb-16">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                  <TabsTrigger
                    value="description"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-4"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-4"
                  >
                    Spécifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-6 py-4"
                  >
                    Avis clients ({product.reviews_count})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="pt-8">
                  <div className="prose max-w-none">
                    <p className="mb-4">{product.description}</p>
                    <p className="mb-4">
                      Ce produit offre une excellente qualité et des performances remarquables. Conçu avec les dernières
                      technologies, il répond aux besoins des utilisateurs les plus exigeants.
                    </p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li>Design moderne et élégant</li>
                      <li>Performances optimales</li>
                      <li>Facilité d'utilisation</li>
                      <li>Garantie constructeur</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="border-b pb-4">
                          <div className="font-semibold mb-2">{key}</div>
                          <div className="text-muted-foreground">{value as string}</div>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-8">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Les avis clients seront bientôt disponibles.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
