import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Marques - Découvrez nos Partenaires | DjigaFlow",
  description:
    "Explorez notre sélection de marques partenaires. Des produits de qualité de marques reconnues mondialement.",
  keywords: "marques, partenaires, qualité, produits, DjigaFlow, brands",
}

export default function BrandsPage() {
  const featuredBrands = [
    {
      name: "TechPro",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Leader mondial en électronique grand public",
      products: 1250,
      rating: 4.8,
      category: "Électronique",
      featured: true,
    },
    {
      name: "StyleMax",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Mode tendance pour tous les styles",
      products: 890,
      rating: 4.6,
      category: "Mode",
      featured: true,
    },
    {
      name: "HomeComfort",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Tout pour votre maison et jardin",
      products: 650,
      rating: 4.7,
      category: "Maison",
      featured: true,
    },
    {
      name: "SportElite",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Équipements sportifs professionnels",
      products: 420,
      rating: 4.9,
      category: "Sport",
      featured: false,
    },
    {
      name: "BeautyGlow",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Cosmétiques et soins de beauté",
      products: 380,
      rating: 4.5,
      category: "Beauté",
      featured: false,
    },
    {
      name: "AutoParts",
      logo: "/placeholder.svg?height=100&width=200",
      description: "Accessoires et pièces automobiles",
      products: 720,
      rating: 4.4,
      category: "Auto",
      featured: false,
    },
  ]

  const categories = [
    { name: "Toutes", count: "4,310", active: true },
    { name: "Électronique", count: "1,250", active: false },
    { name: "Mode", count: "890", active: false },
    { name: "Maison", count: "650", active: false },
    { name: "Sport", count: "420", active: false },
    { name: "Beauté", count: "380", active: false },
    { name: "Auto", count: "720", active: false },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Nos partenaires
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Découvrez nos{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Marques
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Nous travaillons avec les meilleures marques du monde entier pour vous offrir des produits de qualité
                exceptionnelle.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Rechercher une marque..." className="pl-12 pr-4 py-3 text-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Marques partenaires</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Produits disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.7</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">25K+</div>
                <div className="text-sm text-muted-foreground">Clients satisfaits</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Brands */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Marques en vedette</h2>
              <p className="text-xl text-muted-foreground">Nos partenaires les plus populaires et les mieux notés</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredBrands
                .filter((brand) => brand.featured)
                .map((brand, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Populaire
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{brand.rating}</span>
                        </div>
                      </div>

                      <div className="text-center mb-6">
                        <div className="w-32 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            width={128}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{brand.description}</p>
                        <Badge variant="outline">{brand.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Produits disponibles</span>
                        <span className="font-semibold">{brand.products.toLocaleString()}</span>
                      </div>

                      <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                        <Link href={`/catalogue?brand=${brand.name.toLowerCase()}`}>Voir les produits</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>

        {/* All Brands */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Toutes nos marques</h2>
              <p className="text-xl text-muted-foreground">
                Explorez l'ensemble de notre catalogue de marques partenaires
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBrands.map((brand, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Image
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name}
                          width={64}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{brand.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{brand.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {brand.category}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{brand.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{brand.products}</div>
                        <div className="text-xs text-muted-foreground">produits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Charger plus de marques
              </Button>
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Vous êtes une marque ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez notre réseau de partenaires et développez votre présence en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Devenir partenaire
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
