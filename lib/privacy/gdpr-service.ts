import { createClientComponentClient } from "supabase-auth-helpers-nextjs"

interface ConsentRecord {
  user_id: string
  consent_type: "marketing" | "analytics" | "functional" | "necessary"
  granted: boolean
  timestamp: string
  ip_address: string
  user_agent: string
}

interface DataRequest {
  id: string
  user_id: string
  type: "access" | "deletion" | "portability" | "rectification"
  status: "pending" | "processing" | "completed" | "rejected"
  requested_at: string
  completed_at?: string
  data?: any
}

export class GDPRService {
  private supabase = createClientComponentClient()

  async recordConsent(
    userId: string,
    consents: Record<string, boolean>,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    const records = Object.entries(consents).map(([type, granted]) => ({
      user_id: userId,
      consent_type: type as any,
      granted,
      timestamp: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    }))

    await this.supabase.from("consent_records").insert(records)
  }

  async getUserConsents(userId: string): Promise<Record<string, boolean>> {
    const { data } = await this.supabase
      .from("consent_records")
      .select("consent_type, granted")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })

    const consents: Record<string, boolean> = {}

    // Garder seulement le consentement le plus récent pour chaque type
    data?.forEach((record) => {
      if (!(record.consent_type in consents)) {
        consents[record.consent_type] = record.granted
      }
    })

    return consents
  }

  async submitDataRequest(userId: string, type: DataRequest["type"], details?: string): Promise<DataRequest> {
    const { data, error } = await this.supabase
      .from("data_requests")
      .insert({
        user_id: userId,
        type,
        status: "pending",
        details,
        requested_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async processDataAccess(userId: string): Promise<any> {
    // Collecter toutes les données de l'utilisateur
    const userData = await this.collectUserData(userId)

    return {
      personal_info: userData.profile,
      orders: userData.orders,
      reviews: userData.reviews,
      preferences: userData.preferences,
      consent_history: userData.consents,
      activity_log: userData.activities,
    }
  }

  async processDataDeletion(userId: string): Promise<void> {
    // Anonymiser ou supprimer les données selon les exigences légales
    await this.supabase.rpc("anonymize_user_data", { user_id: userId })
  }

  private async collectUserData(userId: string): Promise<any> {
    const [profile, orders, reviews, preferences, consents, activities] = await Promise.all([
      this.supabase.from("user_profiles").select("*").eq("id", userId).single(),
      this.supabase.from("orders").select("*").eq("user_id", userId),
      this.supabase.from("product_reviews").select("*").eq("user_id", userId),
      this.supabase.from("user_preferences").select("*").eq("user_id", userId),
      this.supabase.from("consent_records").select("*").eq("user_id", userId),
      this.supabase.from("user_activities").select("*").eq("user_id", userId),
    ])

    return {
      profile: profile.data,
      orders: orders.data,
      reviews: reviews.data,
      preferences: preferences.data,
      consents: consents.data,
      activities: activities.data,
    }
  }

  async generateDataPortabilityExport(userId: string): Promise<Blob> {
    const userData = await this.collectUserData(userId)

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      data: userData,
    }

    return new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
  }
}
