import { createClientComponentClient } from "path-to-supabase-client" // Assuming the path to the Supabase client

interface LoyaltyTier {
  id: string
  name: string
  min_points: number
  benefits: {
    discount_percentage: number
    free_shipping: boolean
    early_access: boolean
    birthday_bonus: number
    referral_bonus: number
  }
  color: string
}

interface LoyaltyTransaction {
  id: string
  user_id: string
  type: "earn" | "redeem"
  points: number
  reason: string
  order_id?: string
  created_at: string
}

export class LoyaltyProgramService {
  private supabase = createClientComponentClient()

  private tiers: LoyaltyTier[] = [
    {
      id: "bronze",
      name: "Bronze",
      min_points: 0,
      benefits: {
        discount_percentage: 0,
        free_shipping: false,
        early_access: false,
        birthday_bonus: 50,
        referral_bonus: 100,
      },
      color: "#CD7F32",
    },
    {
      id: "silver",
      name: "Argent",
      min_points: 1000,
      benefits: {
        discount_percentage: 5,
        free_shipping: true,
        early_access: false,
        birthday_bonus: 100,
        referral_bonus: 150,
      },
      color: "#C0C0C0",
    },
    {
      id: "gold",
      name: "Or",
      min_points: 5000,
      benefits: {
        discount_percentage: 10,
        free_shipping: true,
        early_access: true,
        birthday_bonus: 200,
        referral_bonus: 200,
      },
      color: "#FFD700",
    },
    {
      id: "platinum",
      name: "Platine",
      min_points: 15000,
      benefits: {
        discount_percentage: 15,
        free_shipping: true,
        early_access: true,
        birthday_bonus: 500,
        referral_bonus: 300,
      },
      color: "#E5E4E2",
    },
  ]

  async getUserLoyaltyStatus(userId: string): Promise<{
    points: number
    tier: LoyaltyTier
    nextTier?: LoyaltyTier
    pointsToNextTier?: number
  }> {
    const { data: user } = await this.supabase.from("user_profiles").select("loyalty_points").eq("id", userId).single()

    const points = user?.loyalty_points || 0
    const tier = this.getTierByPoints(points)
    const nextTier = this.getNextTier(tier)
    const pointsToNextTier = nextTier ? nextTier.min_points - points : undefined

    return {
      points,
      tier,
      nextTier,
      pointsToNextTier,
    }
  }

  async awardPoints(userId: string, points: number, reason: string, orderId?: string): Promise<void> {
    // Enregistrer la transaction
    await this.supabase.from("loyalty_transactions").insert({
      user_id: userId,
      type: "earn",
      points,
      reason,
      order_id: orderId,
      created_at: new Date().toISOString(),
    })

    // Mettre à jour le total des points
    await this.supabase.rpc("add_loyalty_points", {
      user_id: userId,
      points_to_add: points,
    })

    // Vérifier si l'utilisateur a changé de niveau
    await this.checkTierUpgrade(userId)
  }

  async redeemPoints(userId: string, points: number, reason: string): Promise<boolean> {
    const userStatus = await this.getUserLoyaltyStatus(userId)

    if (userStatus.points < points) {
      return false // Pas assez de points
    }

    // Enregistrer la transaction
    await this.supabase.from("loyalty_transactions").insert({
      user_id: userId,
      type: "redeem",
      points: -points,
      reason,
      created_at: new Date().toISOString(),
    })

    // Déduire les points
    await this.supabase.rpc("add_loyalty_points", {
      user_id: userId,
      points_to_add: -points,
    })

    return true
  }

  async calculateOrderPoints(orderTotal: number, userId: string): Promise<number> {
    const userStatus = await this.getUserLoyaltyStatus(userId)

    // 1 point par euro dépensé
    const basePoints = Math.floor(orderTotal)

    // Bonus selon le niveau
    const multiplier = this.getPointsMultiplier(userStatus.tier)

    return Math.floor(basePoints * multiplier)
  }

  async processOrderReward(orderId: string, userId: string, orderTotal: number): Promise<void> {
    const points = await this.calculateOrderPoints(orderTotal, userId)

    await this.awardPoints(userId, points, `Commande #${orderId}`, orderId)
  }

  async processBirthdayBonus(userId: string): Promise<void> {
    const userStatus = await this.getUserLoyaltyStatus(userId)
    const bonusPoints = userStatus.tier.benefits.birthday_bonus

    await this.awardPoints(userId, bonusPoints, "Bonus anniversaire")
  }

  async processReferralReward(referrerId: string, referredUserId: string): Promise<void> {
    const referrerStatus = await this.getUserLoyaltyStatus(referrerId)
    const bonusPoints = referrerStatus.tier.benefits.referral_bonus

    await this.awardPoints(referrerId, bonusPoints, `Parrainage de l'utilisateur ${referredUserId}`)
  }

  async getLoyaltyHistory(userId: string, limit = 50): Promise<LoyaltyTransaction[]> {
    const { data } = await this.supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    return data || []
  }

  async getAvailableRewards(): Promise<any[]> {
    const { data } = await this.supabase
      .from("loyalty_rewards")
      .select("*")
      .eq("active", true)
      .order("points_required", { ascending: true })

    return data || []
  }

  private getTierByPoints(points: number): LoyaltyTier {
    return (
      this.tiers
        .slice()
        .reverse()
        .find((tier) => points >= tier.min_points) || this.tiers[0]
    )
  }

  private getNextTier(currentTier: LoyaltyTier): LoyaltyTier | undefined {
    const currentIndex = this.tiers.findIndex((tier) => tier.id === currentTier.id)
    return this.tiers[currentIndex + 1]
  }

  private getPointsMultiplier(tier: LoyaltyTier): number {
    switch (tier.id) {
      case "silver":
        return 1.2
      case "gold":
        return 1.5
      case "platinum":
        return 2.0
      default:
        return 1.0
    }
  }

  private async checkTierUpgrade(userId: string): Promise<void> {
    const userStatus = await this.getUserLoyaltyStatus(userId)

    // Mettre à jour le niveau dans la base de données
    await this.supabase.from("user_profiles").update({ loyalty_tier: userStatus.tier.id }).eq("id", userId)

    // Envoyer une notification si changement de niveau
    if (userStatus.nextTier && userStatus.pointsToNextTier === 0) {
      await this.sendTierUpgradeNotification(userId, userStatus.tier)
    }
  }

  private async sendTierUpgradeNotification(userId: string, newTier: LoyaltyTier): Promise<void> {
    // Envoyer email de félicitations
    console.log(`Utilisateur ${userId} a atteint le niveau ${newTier.name}`)
  }
}
