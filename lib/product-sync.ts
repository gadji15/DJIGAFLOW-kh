"use server"

import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath, revalidateTag } from "next/cache"

/**
 * SERVICE DE SYNCHRONISATION DES PRODUITS
 *
 * Ce service gère la synchronisation automatique des produits
 * entre l'interface d'administration et l'affichage public.
 *
 * Fonctionnalités :
 * - Invalidation du cache automatique
 * - Mise à jour en temps réel
 * - Gestion des erreurs
 * - Logs de synchronisation
 */

/**
 * INTERFACE POUR LES DONNÉES PRODUIT
 */
export interface ProductData {
  id?: string
  name: string
  description: string
  price: number
  sale_price?: number | null
  stock: number
  category_id: string
  images: string[]
  featured: boolean
  rating?: number
  reviews_count?: number
  specifications?: Record<string, any>
  variants?: Record<string, any>
  tags?: string[]
  meta_title?: string
  meta_description?: string
  slug?: string
}

/**
 * CRÉATION D'UN NOUVEAU PRODUIT
 * Ajoute un produit et met à jour toutes les pages concernées
 */
export async function createProduct(productData: ProductData) {
  try {
    console.log("🔄 Création du produit:", productData.name)

    // Générer un slug unique
    const slug = generateSlug(productData.name)

    // Insérer le produit dans la base de données
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert({
        ...productData,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Erreur lors de la création du produit:", error)
      throw new Error(`Erreur lors de la création du produit: ${error.message}`)
    }

    // Invalider le cache pour toutes les pages concernées
    await invalidateProductCache(product)

    // Log de l'action
    await logProductAction("CREATE", product.id, productData)

    console.log("✅ Produit créé avec succès:", product.id)
    return { success: true, product }
  } catch (error) {
    console.error("❌ Erreur dans createProduct:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

/**
 * MISE À JOUR D'UN PRODUIT EXISTANT
 * Met à jour un produit et synchronise l'affichage
 */
export async function updateProduct(productId: string, productData: Partial<ProductData>) {
  try {
    console.log("🔄 Mise à jour du produit:", productId)

    // Récupérer le produit existant
    const { data: existingProduct } = await supabaseAdmin.from("products").select("*").eq("id", productId).single()

    if (!existingProduct) {
      throw new Error("Produit non trouvé")
    }

    // Mettre à jour le produit
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single()

    if (error) {
      console.error("❌ Erreur lors de la mise à jour:", error)
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`)
    }

    // Invalider le cache
    await invalidateProductCache(product)

    // Log de l'action
    await logProductAction("UPDATE", productId, productData)

    console.log("✅ Produit mis à jour avec succès:", productId)
    return { success: true, product }
  } catch (error) {
    console.error("❌ Erreur dans updateProduct:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

/**
 * SUPPRESSION D'UN PRODUIT
 * Supprime un produit et met à jour l'affichage
 */
export async function deleteProduct(productId: string) {
  try {
    console.log("🔄 Suppression du produit:", productId)

    // Récupérer le produit avant suppression
    const { data: product } = await supabaseAdmin.from("products").select("*").eq("id", productId).single()

    if (!product) {
      throw new Error("Produit non trouvé")
    }

    // Supprimer le produit
    const { error } = await supabaseAdmin.from("products").delete().eq("id", productId)

    if (error) {
      console.error("❌ Erreur lors de la suppression:", error)
      throw new Error(`Erreur lors de la suppression: ${error.message}`)
    }

    // Invalider le cache
    await invalidateProductCache(product)

    // Log de l'action
    await logProductAction("DELETE", productId, { name: product.name })

    console.log("✅ Produit supprimé avec succès:", productId)
    return { success: true }
  } catch (error) {
    console.error("❌ Erreur dans deleteProduct:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

/**
 * INVALIDATION DU CACHE POUR UN PRODUIT
 * Met à jour toutes les pages qui affichent ce produit
 */
async function invalidateProductCache(product: any) {
  try {
    console.log("🔄 Invalidation du cache pour le produit:", product.id)

    // Pages spécifiques au produit
    revalidatePath(`/produit/${product.id}`)
    revalidatePath(`/produit/${product.slug}`)

    // Pages de catalogue
    revalidatePath("/catalogue")
    revalidatePath(`/catalogue/${product.category_id}`)

    // Page d'accueil (si produit en vedette)
    if (product.featured) {
      revalidatePath("/")
    }

    // Pages de recherche et filtres
    revalidatePath("/recherche")
    revalidatePath("/nouveautes")
    revalidatePath("/promotions")

    // Interface d'administration
    revalidatePath("/admin/produits")
    revalidatePath(`/admin/produits/${product.id}`)

    // Tags de cache pour les composants
    revalidateTag("products")
    revalidateTag("featured-products")
    revalidateTag(`product-${product.id}`)
    revalidateTag(`category-${product.category_id}`)

    console.log("✅ Cache invalidé avec succès")
  } catch (error) {
    console.error("❌ Erreur lors de l'invalidation du cache:", error)
  }
}

/**
 * GÉNÉRATION D'UN SLUG UNIQUE
 * Crée un slug URL-friendly à partir du nom du produit
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garder seulement lettres, chiffres, espaces et tirets
    .trim()
    .replace(/\s+/g, "-") // Remplacer espaces par tirets
    .replace(/-+/g, "-") // Éviter les tirets multiples
}

/**
 * LOG DES ACTIONS SUR LES PRODUITS
 * Enregistre les modifications pour audit et debug
 */
async function logProductAction(action: "CREATE" | "UPDATE" | "DELETE", productId: string, data: any) {
  try {
    await supabaseAdmin.from("product_logs").insert({
      action,
      product_id: productId,
      data,
      timestamp: new Date().toISOString(),
      user_id: "admin", // À remplacer par l'ID utilisateur réel
    })
  } catch (error) {
    console.error("❌ Erreur lors du logging:", error)
  }
}

/**
 * SYNCHRONISATION COMPLÈTE DES PRODUITS
 * Force la mise à jour de toutes les pages produits
 */
export async function syncAllProducts() {
  try {
    console.log("🔄 Synchronisation complète des produits...")

    // Invalider toutes les pages liées aux produits
    revalidatePath("/")
    revalidatePath("/catalogue")
    revalidatePath("/nouveautes")
    revalidatePath("/promotions")
    revalidatePath("/recherche")
    revalidatePath("/admin/produits")

    // Invalider tous les tags de cache
    revalidateTag("products")
    revalidateTag("featured-products")
    revalidateTag("categories")

    console.log("✅ Synchronisation complète terminée")
    return { success: true }
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}

/**
 * VÉRIFICATION DE LA COHÉRENCE DES DONNÉES
 * Vérifie que les produits sont correctement affichés
 */
export async function validateProductDisplay(productId: string) {
  try {
    console.log("🔍 Vérification de l'affichage du produit:", productId)

    // Vérifier que le produit existe
    const { data: product, error } = await supabaseAdmin.from("products").select("*").eq("id", productId).single()

    if (error || !product) {
      return {
        success: false,
        error: "Produit non trouvé dans la base de données",
      }
    }

    // Vérifications de cohérence
    const issues = []

    if (!product.name || product.name.trim() === "") {
      issues.push("Nom du produit manquant")
    }

    if (!product.description || product.description.trim() === "") {
      issues.push("Description du produit manquante")
    }

    if (!product.price || product.price <= 0) {
      issues.push("Prix du produit invalide")
    }

    if (!product.images || product.images.length === 0) {
      issues.push("Aucune image du produit")
    }

    if (!product.category_id) {
      issues.push("Catégorie du produit manquante")
    }

    if (issues.length > 0) {
      console.warn("⚠️ Problèmes détectés:", issues)
      return {
        success: false,
        error: "Problèmes de données détectés",
        issues,
      }
    }

    console.log("✅ Produit valide et cohérent")
    return { success: true, product }
  } catch (error) {
    console.error("❌ Erreur lors de la validation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    }
  }
}
