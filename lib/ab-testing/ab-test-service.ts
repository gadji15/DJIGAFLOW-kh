import { createClientComponentClient } from "supabase-auth-helpers-nextjs"

interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "completed" | "paused"
  variants: ABVariant[]
  traffic_allocation: number
  start_date: string
  end_date?: string
  metrics: string[]
  target_audience?: any
}

interface ABVariant {
  id: string
  name: string
  traffic_percentage: number
  config: any
  conversions: number
  visitors: number
}

export class ABTestService {
  private supabase = createClientComponentClient()

  async createTest(test: Omit<ABTest, "id">): Promise<ABTest> {
    const { data, error } = await this.supabase.from("ab_tests").insert(test).select().single()

    if (error) throw error
    return data
  }

  async getActiveTests(): Promise<ABTest[]> {
    const { data, error } = await this.supabase
      .from("ab_tests")
      .select(`
        *,
        variants:ab_test_variants(*)
      `)
      .eq("status", "running")

    if (error) throw error
    return data || []
  }

  async assignUserToVariant(testId: string, userId: string, sessionId: string): Promise<ABVariant | null> {
    // Vérifier si l'utilisateur est déjà assigné
    const { data: existing } = await this.supabase
      .from("ab_test_assignments")
      .select("variant_id, ab_test_variants(*)")
      .eq("test_id", testId)
      .eq("user_id", userId)
      .single()

    if (existing) {
      return existing.ab_test_variants
    }

    // Récupérer le test et ses variantes
    const { data: test } = await this.supabase
      .from("ab_tests")
      .select(`
        *,
        variants:ab_test_variants(*)
      `)
      .eq("id", testId)
      .single()

    if (!test || test.status !== "running") return null

    // Assigner une variante basée sur la distribution du trafic
    const variant = this.selectVariant(test.variants, userId)

    if (variant) {
      // Enregistrer l'assignation
      await this.supabase.from("ab_test_assignments").insert({
        test_id: testId,
        user_id: userId,
        session_id: sessionId,
        variant_id: variant.id,
        assigned_at: new Date().toISOString(),
      })

      // Incrémenter le compteur de visiteurs
      await this.supabase
        .from("ab_test_variants")
        .update({ visitors: variant.visitors + 1 })
        .eq("id", variant.id)
    }

    return variant
  }

  private selectVariant(variants: ABVariant[], userId: string): ABVariant | null {
    // Utiliser un hash du userId pour une distribution cohérente
    const hash = this.hashString(userId)
    const random = (hash % 100) / 100

    let cumulative = 0
    for (const variant of variants) {
      cumulative += variant.traffic_percentage / 100
      if (random <= cumulative) {
        return variant
      }
    }

    return variants[0] // Fallback
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  async trackConversion(testId: string, userId: string, metric: string, value?: number): Promise<void> {
    // Récupérer l'assignation de l'utilisateur
    const { data: assignment } = await this.supabase
      .from("ab_test_assignments")
      .select("variant_id")
      .eq("test_id", testId)
      .eq("user_id", userId)
      .single()

    if (!assignment) return

    // Enregistrer la conversion
    await this.supabase.from("ab_test_conversions").insert({
      test_id: testId,
      variant_id: assignment.variant_id,
      user_id: userId,
      metric,
      value: value || 1,
      converted_at: new Date().toISOString(),
    })

    // Mettre à jour le compteur de conversions de la variante
    await this.supabase.rpc("increment_variant_conversions", {
      variant_id: assignment.variant_id,
    })
  }

  async getTestResults(testId: string): Promise<any> {
    const { data: results } = await this.supabase.from("ab_test_results_view").select("*").eq("test_id", testId)

    return results
  }
}
