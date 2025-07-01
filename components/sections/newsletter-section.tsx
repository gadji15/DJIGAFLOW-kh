"use client"
import React, { useState } from "react"
import { createClientComponentClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

/**
 * Section d'inscription à la newsletter (stocke les emails dans Supabase).
 * - Gère loading, succès, erreurs.
 * - Stylée et accessible.
 */
export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      // Ajoutez votre logique Supabase ici
      const supabase = createClientComponentClient<Database>()
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, subscribed_at: new Date().toISOString() })
      if (error) throw error
      setSuccess(true)
      setEmail("")
    } catch (err: any) {
      setError("Erreur lors de l'inscription. Essayez une autre adresse ou plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-14 px-4 md:px-8 max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Abonnez-vous à la newsletter</h2>
      <p className="mb-6 text-gray-600">
        Recevez nos nouveautés, promos et conseils exclusifs directement dans votre boîte mail.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        aria-label="Formulaire d'inscription à la newsletter"
      >
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
          autoComplete="email"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-70"
          disabled={loading || !email}
        >
          {loading ? "Envoi..." : "Je m'abonne"}
        </button>
      </form>
      {error && <div className="mt-3 text-red-600">{error}</div>}
      {success && <div className="mt-3 text-green-600 font-semibold">Merci pour votre inscription !</div>}
    </section>
  )
}