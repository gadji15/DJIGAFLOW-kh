import { Suspense } from "react"
import { ProfessionalHeader } from "@/components/professional-header"
import { ProfessionalFooter } from "@/components/professional-footer"
import { ProductCard } from "@/components/product-card"
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveTypography,
  ResponsiveFlex,
  ResponsiveButton,
  ResponsiveImage,
} from "@/components/ui/responsive-design-system"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollToTop } from "@/components/scroll-to-top"
import { mockData, queryData } from "@/lib/supabase"
import Link from "next/link"
import { ShoppingBag, Truck, Shield, Star, ArrowRight, Zap, Users, Heart, Gift, Award, Clock } from "lucide-react"

async function getFeaturedProducts() {
  return await queryData(mockData.featuredProducts)
}

async function getCategories() {
  return await queryData(mockData.categories)
}

function ProductsSkeleton() {
  return (
    <ResponsiveGrid cols="auto">
      {Array.from({ length: 8 }).map((_, i) => (
        <ResponsiveCard key={i} size="md">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-6 w-1/3" />
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  )
}

function CategoriesSkeleton() {
  return (
    <ResponsiveGrid cols={6}>
      {Array.from({ length: 6 }).map((_, i) => (
        <ResponsiveCard key={i} size="md" className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-3" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  )
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <ResponsiveGrid cols="auto">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ResponsiveGrid>
  )
}

async function CategoriesSection() {
  const categories = await getCategories()

  return (
    <ResponsiveGrid cols={6}>
      {categories.map((category: any) => (
        <ResponsiveCard key={category.id} size="md" hover="all" className="text-center group cursor-pointer">
          <Link href={`/catalogue?category=${category.slug}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-bold">{category.name.charAt(0).toUpperCase()}</span>
            </div>
            <ResponsiveTypography variant="body" className="font-medium group-hover:text-primary transition-colors">
              {category.name}
            </ResponsiveTypography>
          </Link>
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  )
}

export default function HomePage() {
  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Livraison rapide",
      description: "Livraison express en 24-48h partout en France",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Paiement sécurisé",
      description: "Transactions 100% sécurisées avec cryptage SSL",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Satisfaction garantie",
      description: "Retour gratuit sous 30 jours, satisfait ou remboursé",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Support 24/7",
      description: "Équipe dédiée disponible 24h/24 et 7j/7",
      color: "from-orange-500 to-orange-600",
    },
  ]

  const stats = [
    { value: "10K+", label: "Produits", icon: <ShoppingBag className="w-6 h-6" /> },
    { value: "50K+", label: "Clients satisfaits", icon: <Users className="w-6 h-6" /> },
    { value: "99%", label: "Satisfaction", icon: <Award className="w-6 h-6" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ProfessionalHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <ResponsiveContainer size="full" spacing="xl">
            <ResponsiveFlex direction="responsive-row" align="center" gap="xl">
              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="space-y-6">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    Nouveau : Livraison express disponible
                  </Badge>

                  <ResponsiveTypography variant="h1" color="gradient" align="center" className="lg:text-left">
                    DjigaFlow
                  </ResponsiveTypography>

                  <ResponsiveTypography
                    variant="body-lg"
                    color="muted"
                    align="center"
                    className="lg:text-left max-w-3xl mx-auto lg:mx-0"
                  >
                    Votre plateforme de dropshipping nouvelle génération. Découvrez des milliers de produits tendance à
                    prix imbattables.
                  </ResponsiveTypography>
                </div>

                <ResponsiveFlex direction="responsive-row" justify="center" gap="md" className="lg:justify-start">
                  <ResponsiveButton variant="gradient" size="lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Découvrir nos produits
                  </ResponsiveButton>
                  <ResponsiveButton variant="outline" size="lg">
                    <Star className="w-5 h-5 mr-2" />
                    Nouveautés
                  </ResponsiveButton>
                </ResponsiveFlex>

                {/* Stats */}
                <ResponsiveGrid cols={4} className="pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <ResponsiveFlex direction="col" align="center" gap="xs">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white mb-2">
                          {stat.icon}
                        </div>
                        <ResponsiveTypography variant="h4" color="primary" className="font-bold">
                          {stat.value}
                        </ResponsiveTypography>
                        <ResponsiveTypography variant="caption" color="muted">
                          {stat.label}
                        </ResponsiveTypography>
                      </ResponsiveFlex>
                    </div>
                  ))}
                </ResponsiveGrid>
              </div>

              {/* Hero Image */}
              <div className="flex-1 lg:flex-none lg:w-1/2">
                <ResponsiveImage
                  src="/placeholder.svg?height=600&width=800"
                  alt="DjigaFlow Hero"
                  aspectRatio="landscape"
                  className="w-full max-w-2xl mx-auto"
                />
              </div>
            </ResponsiveFlex>
          </ResponsiveContainer>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <ResponsiveTypography variant="h2" className="mb-4">
                Pourquoi choisir DjigaFlow ?
              </ResponsiveTypography>
              <ResponsiveTypography variant="body-lg" color="muted" className="max-w-2xl mx-auto">
                Une expérience d'achat exceptionnelle avec des avantages uniques
              </ResponsiveTypography>
            </div>

            <ResponsiveGrid cols={4}>
              {features.map((feature, index) => (
                <ResponsiveCard key={index} size="lg" hover="all" className="text-center group">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <ResponsiveTypography variant="h5" className="mb-3">
                    {feature.title}
                  </ResponsiveTypography>
                  <ResponsiveTypography variant="body" color="muted">
                    {feature.description}
                  </ResponsiveTypography>
                </ResponsiveCard>
              ))}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <ResponsiveTypography variant="h2" className="mb-4">
                Explorez nos catégories
              </ResponsiveTypography>
              <ResponsiveTypography variant="body-lg" color="muted" className="max-w-2xl mx-auto">
                Trouvez exactement ce que vous cherchez dans nos catégories soigneusement organisées
              </ResponsiveTypography>
            </div>

            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesSection />
            </Suspense>

            <div className="text-center mt-12">
              <ResponsiveButton variant="outline" size="lg">
                Voir toutes les catégories
                <ArrowRight className="w-4 h-4 ml-2" />
              </ResponsiveButton>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 lg:py-24">
          <ResponsiveContainer>
            <div className="text-center mb-16">
              <ResponsiveTypography variant="h2" className="mb-4">
                Produits en vedette
              </ResponsiveTypography>
              <ResponsiveTypography variant="body-lg" color="muted" className="max-w-2xl mx-auto">
                Découvrez notre sélection de produits populaires et tendance
              </ResponsiveTypography>
            </div>

            <Suspense fallback={<ProductsSkeleton />}>
              <FeaturedProducts />
            </Suspense>

            <div className="text-center mt-16">
              <ResponsiveButton variant="gradient" size="lg">
                Voir tous les produits
                <ArrowRight className="w-5 h-5 ml-2" />
              </ResponsiveButton>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <ResponsiveContainer>
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <ResponsiveTypography variant="h2" className="text-white">
                  Restez informé des dernières nouveautés
                </ResponsiveTypography>
                <ResponsiveTypography variant="body-lg" className="text-blue-100 max-w-2xl mx-auto">
                  Inscrivez-vous à notre newsletter et recevez en exclusivité nos offres spéciales et nouveaux produits
                </ResponsiveTypography>
              </div>

              <div className="max-w-md mx-auto">
                <ResponsiveFlex gap="sm">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <ResponsiveButton variant="secondary" size="lg">
                    <Gift className="w-4 h-4 mr-2" />
                    S'inscrire
                  </ResponsiveButton>
                </ResponsiveFlex>
                <ResponsiveTypography variant="caption" className="text-blue-100 mt-3">
                  Pas de spam, désinscription possible à tout moment
                </ResponsiveTypography>
              </div>
            </div>
          </ResponsiveContainer>
        </section>
      </main>

      <ProfessionalFooter />
      <ScrollToTop />
    </div>
  )
}
