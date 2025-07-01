"use client"

import { motion } from "framer-motion"
import { Users, Package, Star, Globe, Award, Zap } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Clients Satisfaits",
    description: "Nous font confiance chaque jour",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Package,
    value: "10,000+",
    label: "Produits Premium",
    description: "Sélectionnés avec expertise",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Note Moyenne",
    description: "Basée sur 25,000+ avis",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Pays Desservis",
    description: "Livraison internationale",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Award,
    value: "99.8%",
    label: "Taux de Satisfaction",
    description: "Service client d'excellence",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Zap,
    value: "24h",
    label: "Traitement Express",
    description: "Commandes traitées rapidement",
    color: "from-teal-500 to-teal-600",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">DjigaFlow en Chiffres</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Des résultats qui témoignent de notre engagement envers l'excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div
                        className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-300`}
                      />
                    </div>

                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                      {stat.value}
                    </div>

                    <div className="text-xl font-semibold text-blue-100 mb-2">{stat.label}</div>

                    <div className="text-blue-200/80 text-sm">{stat.description}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
