"use client"
import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

type Category = Database["public"]["Tables"]["categories"]["Row"]

/**
 * Affiche une grille de catégories issues de Supabase.
 * - Gère le chargement, l'erreur et l'absence de données.
 * - Stylé avec Tailwind, responsive.
 */
export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClientComponentClient<Database>()
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("sort_order", { ascending: true })
        if (error) throw error
        setCategories(data || [])
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement des catégories.")
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Catégories</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-primary rounded-full"></span>
          <span className="ml-4 text-lg text-gray-500">Chargement...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-8">{error}</div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-500 font-medium py-8">Aucune catégorie à afficher.</div>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              {/* Vous pouvez personnaliser l'affichage de l'icône ou image ici */}
              <div className="mb-3 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full text-2xl text-primary">
                {(cat.icon as string) || "📦"}
              </div>
              <div className="text-lg font-semibold text-gray-900 text-center">{cat.name}</div>
              {cat.slug && (
                <div className="mt-1 text-xs text-gray-500 text-center lowercase">{cat.slug}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}