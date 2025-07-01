"use client"
import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"]

/**
 * Affiche des témoignages clients depuis Supabase ou des exemples par défaut.
 * - Gère le chargement, l'erreur et l'absence de données.
 * - Stylé pour être attractif (grille responsive).
 */
export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback d'exemple si la table n'existe pas encore
  const sampleTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "Jean Dupont",
      content: "Service impeccable, livraison rapide et produits de qualité.",
      avatar_url: "",
      title: "Entrepreneur",
      rating: 5,
      created_at: "",
    } as Testimonial,
    {
      id: 2,
      name: "Sophie Martin",
      content: "Très satisfaite de mon achat, je recommande à 100%.",
      avatar_url: "",
      title: "Designer",
      rating: 5,
      created_at: "",
    } as Testimonial,
    {
      id: 3,
      name: "Marc Leroy",
      content: "Assistance client très réactive et à l'écoute.",
      avatar_url: "",
      title: "Développeur",
      rating: 4,
      created_at: "",
    } as Testimonial,
  ]

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClientComponentClient<Database>()
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8)
        if (error) throw error
        setTestimonials(data && data.length > 0 ? data : sampleTestimonials)
      } catch (e: any) {
        setError("Impossible de charger les témoignages. Affichage des exemples.")
        setTestimonials(sampleTestimonials)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
    // eslint-disable-next-line
  }, [])

  return (
    <section className="py-14 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Ce que disent nos clients</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-primary rounded-full"></span>
          <span className="ml-4 text-lg text-gray-500">Chargement...</span>
        </div>
      ) : error ? (
        <div className="text-center text-orange-600 font-semibold py-8">{error}</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-50 hover:shadow-xl transition"
            >
              <div className="mb-4">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary">
                    {t.name?.charAt(0) || "👤"}
                  </div>
                )}
              </div>
              <div className="mb-2 text-lg font-semibold">{t.name}</div>
              <div className="mb-1 text-sm text-gray-500">{t.title || ""}</div>
              <div className="flex gap-1 mb-2 justify-center">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-base">★</span>
                ))}
              </div>
              <blockquote className="text-gray-600 italic">"{t.content}"</blockquote>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}