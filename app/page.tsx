import type { Metadata } from "next"
import { Suspense } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { ProductsSection } from "@/components/sections/products-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { StatsSection } from "@/components/sections/stats-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "DjigaFlow - Marketplace Professionnel",
  description:
    "Découvrez DjigaFlow, votre marketplace professionnel de confiance. Produits de qualité, livraison rapide et service client exceptionnel.",
  openGraph: {
    title: "DjigaFlow - Marketplace Professionnel",
    description: "Votre marketplace de confiance pour tous vos achats en ligne.",
    images: ["/images/hero-og.jpg"],
  },
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-96 w-full" />
      <div className="container mx-auto px-4 space-y-8">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<PageSkeleton />}>
        {/* Hero Section with Dynamic Background */}
        <HeroSection />

        {/* Trust Indicators */}
        <StatsSection />

        {/* Key Features */}
        <FeaturesSection />

        {/* Featured Products */}
        <ProductsSection />

        {/* Categories Showcase */}
        <CategoriesSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Newsletter Signup */}
        <NewsletterSection />
      </Suspense>
    </div>
  )
}
