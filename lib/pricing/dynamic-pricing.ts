import { createClientComponentClient } from "supabase-auth-helpers-nextjs"

interface PricingRule {
  id: string
  name: string
  type: "demand" | "inventory" | "competitor" | "time" | "user_segment"
  conditions: any
  adjustment_type: "percentage" | "fixed"
  adjustment_value: number
  priority: number
  active: boolean
}

export class DynamicPricingEngine {
  private supabase = createClientComponentClient()

  async calculateDynamicPrice(
    productId: string,
    basePrice: number,
    userId?: string,
  ): Promise<{ price: number; adjustments: any[] }> {
    // Récupérer les règles de prix actives
    const { data: rules } = await this.supabase
      .from("pricing_rules")
      .select("*")
      .eq("active", true)
      .order("priority", { ascending: false })

    if (!rules) return { price: basePrice, adjustments: [] }

    let finalPrice = basePrice
    const appliedAdjustments: any[] = []

    for (const rule of rules) {
      const adjustment = await this.evaluateRule(rule, productId, userId)
      if (adjustment) {
        if (rule.adjustment_type === "percentage") {
          finalPrice *= 1 + adjustment.value / 100
        } else {
          finalPrice += adjustment.value
        }
        appliedAdjustments.push(adjustment)
      }
    }

    return {
      price: Math.max(finalPrice, basePrice * 0.5), // Prix minimum = 50% du prix de base
      adjustments: appliedAdjustments,
    }
  }

  private async evaluateRule(rule: PricingRule, productId: string, userId?: string): Promise<any | null> {
    switch (rule.type) {
      case "demand":
        return this.evaluateDemandRule(rule, productId)
      case "inventory":
        return this.evaluateInventoryRule(rule, productId)
      case "time":
        return this.evaluateTimeRule(rule)
      case "user_segment":
        return this.evaluateUserSegmentRule(rule, userId)
      default:
        return null
    }
  }

  private async evaluateDemandRule(rule: PricingRule, productId: string): Promise<any | null> {
    // Calculer la demande récente
    const { data: recentViews } = await this.supabase
      .from("product_analytics")
      .select("views_count")
      .eq("product_id", productId)
      .gte("date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const totalViews = recentViews?.reduce((sum, item) => sum + item.views_count, 0) || 0

    if (totalViews > rule.conditions.threshold) {
      return {
        rule_name: rule.name,
        type: "demand_surge",
        value: rule.adjustment_value,
        reason: `Forte demande: ${totalViews} vues cette semaine`,
      }
    }

    return null
  }

  private async evaluateInventoryRule(rule: PricingRule, productId: string): Promise<any | null> {
    const { data: product } = await this.supabase.from("products").select("stock").eq("id", productId).single()

    if (!product) return null

    if (product.stock <= rule.conditions.low_stock_threshold) {
      return {
        rule_name: rule.name,
        type: "low_inventory",
        value: rule.adjustment_value,
        reason: `Stock faible: ${product.stock} unités restantes`,
      }
    }

    return null
  }

  private evaluateTimeRule(rule: PricingRule): any | null {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()

    // Exemple: prix réduits le weekend
    if (rule.conditions.weekend_discount && (day === 0 || day === 6)) {
      return {
        rule_name: rule.name,
        type: "weekend_discount",
        value: rule.adjustment_value,
        reason: "Promotion weekend",
      }
    }

    // Exemple: prix augmentés aux heures de pointe
    if (rule.conditions.peak_hours && hour >= rule.conditions.peak_start && hour <= rule.conditions.peak_end) {
      return {
        rule_name: rule.name,
        type: "peak_hours",
        value: rule.adjustment_value,
        reason: "Heures de pointe",
      }
    }

    return null
  }

  private async evaluateUserSegmentRule(rule: PricingRule, userId?: string): Promise<any | null> {
    if (!userId) return null

    const { data: userProfile } = await this.supabase
      .from("user_profiles")
      .select("segment, loyalty_tier")
      .eq("id", userId)
      .single()

    if (!userProfile) return null

    // Remise pour les clients fidèles
    if (rule.conditions.loyalty_discount && userProfile.loyalty_tier === rule.conditions.required_tier) {
      return {
        rule_name: rule.name,
        type: "loyalty_discount",
        value: rule.adjustment_value,
        reason: `Remise fidélité ${userProfile.loyalty_tier}`,
      }
    }

    return null
  }
}
