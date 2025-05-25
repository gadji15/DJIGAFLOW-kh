import { createClientComponentClient } from "path-to-supabase-client" // Import the createClientComponentClient function

interface UserBehavior {
  user_id: string
  product_views: string[]
  categories_viewed: string[]
  purchases: string[]
  search_queries: string[]
  time_spent: Record<string, number>
}

interface ProductSimilarity {
  product_id: string
  similar_products: Array<{
    id: string
    similarity_score: number
  }>
}

export class RecommendationEngine {
  private supabase = createClientComponentClient()

  async trackUserBehavior(
    userId: string,
    action: "view" | "purchase" | "search" | "add_to_cart",
    data: any,
  ): Promise<void> {
    await this.supabase.from("user_behavior_tracking").insert({
      user_id: userId,
      action,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  async getPersonalizedRecommendations(userId: string, limit = 10): Promise<any[]> {
    // 1. Récupérer le comportement de l'utilisateur
    const { data: behavior } = await this.supabase
      .from("user_behavior_tracking")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(100)

    if (!behavior || behavior.length === 0) {
      return this.getPopularProducts(limit)
    }

    // 2. Analyser les préférences
    const preferences = this.analyzeUserPreferences(behavior)

    // 3. Générer des recommandations basées sur:
    // - Produits similaires aux vues récentes
    // - Catégories préférées
    // - Filtrage collaboratif
    const recommendations = await this.generateRecommendations(preferences, limit)

    return recommendations
  }

  private analyzeUserPreferences(behavior: any[]): any {
    const categories: Record<string, number> = {}
    const brands: Record<string, number> = {}
    const priceRanges: number[] = []

    behavior.forEach((item) => {
      if (item.action === "view" && item.data.category) {
        categories[item.data.category] = (categories[item.data.category] || 0) + 1
      }
      if (item.data.brand) {
        brands[item.data.brand] = (brands[item.data.brand] || 0) + 1
      }
      if (item.data.price) {
        priceRanges.push(item.data.price)
      }
    })

    return {
      preferredCategories: Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category),
      preferredBrands: Object.entries(brands)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([brand]) => brand),
      averagePrice: priceRanges.length > 0 ? priceRanges.reduce((a, b) => a + b, 0) / priceRanges.length : 0,
    }
  }

  private async generateRecommendations(preferences: any, limit: number): Promise<any[]> {
    let query = this.supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_reviews(rating)
      `)
      .eq("status", "active")

    // Filtrer par catégories préférées
    if (preferences.preferredCategories.length > 0) {
      query = query.in("category_id", preferences.preferredCategories)
    }

    // Filtrer par gamme de prix
    if (preferences.averagePrice > 0) {
      const minPrice = preferences.averagePrice * 0.7
      const maxPrice = preferences.averagePrice * 1.5
      query = query.gte("price", minPrice).lte("price", maxPrice)
    }

    const { data: products } = await query.limit(limit * 2)

    if (!products) return []

    // Calculer le score de recommandation
    return products
      .map((product) => ({
        ...product,
        recommendation_score: this.calculateRecommendationScore(product, preferences),
      }))
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, limit)
  }

  private calculateRecommendationScore(product: any, preferences: any): number {
    let score = 0

    // Score basé sur la catégorie
    if (preferences.preferredCategories.includes(product.category_id)) {
      score += 0.4
    }

    // Score basé sur la marque
    if (preferences.preferredBrands.includes(product.brand)) {
      score += 0.3
    }

    // Score basé sur le prix
    if (preferences.averagePrice > 0) {
      const priceDiff = Math.abs(product.price - preferences.averagePrice) / preferences.averagePrice
      score += Math.max(0, 0.2 * (1 - priceDiff))
    }

    // Score basé sur les avis
    const avgRating =
      product.product_reviews?.reduce((sum: number, review: any) => sum + review.rating, 0) /
      (product.product_reviews?.length || 1)
    score += (avgRating / 5) * 0.1

    return score
  }

  private async getPopularProducts(limit: number): Promise<any[]> {
    const { data } = await this.supabase
      .from("products")
      .select(`
        *,
        categories(name),
        product_reviews(rating)
      `)
      .eq("status", "active")
      .order("views_count", { ascending: false })
      .limit(limit)

    return data || []
  }
}
