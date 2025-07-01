"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Shield, Truck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const heroSlides = [
  {
    id: 1,
    title: "Découvrez nos nouveautés",
    subtitle: "Collection Automne-Hiver 2024",
    description: "Les dernières tendances mode et tech à prix imbattables",
    image: "/placeholder.svg?height=600&width=800&text=Nouveautés",
    cta: "Découvrir",
    ctaLink: "/nouveautes",
    badge: "Nouveau",
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 2,
    title: "Promotions exceptionnelles",
    subtitle: "Jusqu'à -70% sur une sélection",
    description: "Profitez de nos offres limitées sur vos marques préférées",
    image: "/placeholder.svg?height=600&width=800&text=Promotions",
    cta: "Voir les offres",
    ctaLink: "/promotions",
    badge: "-70%",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 3,
    title: "Livraison gratuite",
    subtitle: "Dès 50€ d'achat",
    description: "Commandez maintenant et recevez vos produits rapidement",
    image: "/placeholder.svg?height=600&width=800&text=Livraison",
    cta: "Commander",
    ctaLink: "/catalogue",
    badge: "Gratuit",
    color: "from-green-500 to-teal-500",
  },
]

const features = [
  {
    icon: Zap,
    title: "Livraison express",
    description: "24-48h partout en France",
  },
  {
    icon: Shield,
    title: "Paiement sécurisé",
    description: "SSL et 3D Secure",
  },
  {
    icon: Truck,
    title: "Retours gratuits",
    description: "30 jours pour changer d'avis",
  },
]

export function MobileOptimizedHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
      {/* Hero Carousel */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.color}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <img
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-white space-y-6"
                  >
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                      {currentSlideData.badge}
                    </Badge>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {currentSlideData.title}
                      </h1>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-medium opacity-90">
                        {currentSlideData.subtitle}
                      </h2>
                      <p className="text-lg md:text-xl opacity-80 max-w-2xl">{currentSlideData.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" asChild className="bg-white text-black hover:bg-white/90">
                        <Link href={currentSlideData.ctaLink}>
                          {currentSlideData.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10 bg-transparent"
                      >
                        En savoir plus
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="hidden lg:block"
                  >
                    <div className="relative">
                      <img
                        src={currentSlideData.image || "/placeholder.svg"}
                        alt={currentSlideData.title}
                        className="w-full h-auto rounded-lg shadow-2xl"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-white/30"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
