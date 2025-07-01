"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, Headphones, CreditCard, Award, Zap, RefreshCw, Globe } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Livraison Express",
    description: "Livraison gratuite dès 50€ d'achat avec suivi en temps réel",
    color: "from-blue-500 to-blue-600",
    delay: 0,
  },
  {
    icon: Shield,
    title: "Paiement Sécurisé",
    description: "Transactions protégées par cryptage SSL et 3D Secure",
    color: "from-green-500 to-green-600",
    delay: 0.1,
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Équipe dédiée disponible pour vous aider à tout moment",
    color: "from-purple-500 to-purple-600",
    delay: 0.2,
  },
  {
    icon: Award,
    title: "Qualité Premium",
    description: "Produits sélectionnés et certifiés par nos experts",
    color: "from-orange-500 to-orange-600",
    delay: 0.3,
  },
  {
    icon: RefreshCw,
    title: "Retours Gratuits",
    description: "30 jours pour changer d'avis, retours sans frais",
    color: "from-teal-500 to-teal-600",
    delay: 0.4,
  },
  {
    icon: CreditCard,
    title: "Paiement Flexible",
    description: "Paiement en 3x sans frais ou différé selon vos besoins",
    color: "from-indigo-500 to-indigo-600",
    delay: 0.5,
  },
  {
    icon: Zap,
    title: "Traitement Rapide",
    description: "Commandes traitées et expédiées sous 24h ouvrées",
    color: "from-yellow-500 to-yellow-600",
    delay: 0.6,
  },
  {
    icon: Globe,
    title: "Livraison Mondiale",
    description: "Expédition dans plus de 50 pays avec suivi complet",
    color: "from-pink-500 to-pink-600",
    delay: 0.7,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Pourquoi Choisir DjigaFlow ?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Nous nous engageons à vous offrir une expérience d'achat exceptionnelle avec des services premium
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}
                      />
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
