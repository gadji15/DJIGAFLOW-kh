"use client"
import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"
import Image from "next/image"

type Product = Database["public"]["Tables"]["products"]["Row"]

/**
 * Affiche une grille de produits à partir de la base Supabase.
 * - Affiche un spinner de chargement pendant la récupération.
 * - Affiche un message si aucun produit n'est disponible.
 * - Affiche une erreur en cas de problème réseau/Supabase.
 */
export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClientComponentClient<Database>()
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(12)
        if (error) throw error
        setProducts(data || [])
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement des produits.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Nos Produits</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-primary rounded-full"></span>
          <span className="ml-4 text-lg text-gray-500">Chargement...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-8">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 font-medium py-8">Aucun produit disponible pour le moment.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col"
            >
              {product.images && product.images.length > 0 ? (
                <div className="relative aspect-square mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg aspect-square mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-300">🛒</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-500 flex-1">{product.description?.slice(0, 80) ?? "Aucune description."}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{(product.price ?? 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                {/* TODO: Remplacez par un vrai bouton panier ou lien produit */}
                <button
                  className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 text-sm font-medium transition"
                  type="button"
                  disabled
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}