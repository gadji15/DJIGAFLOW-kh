"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Star,
  Gift,
  Zap,
  Target,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  ShoppingBag,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  points: number
  unlocked: boolean
  progress: number
  maxProgress: number
  rarity: "common" | "rare" | "epic" | "legendary"
  category: "shopping" | "social" | "loyalty" | "special"
}

interface LoyaltyLevel {
  level: number
  name: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  color: string
  icon: React.ReactNode
}

interface UserStats {
  totalPoints: number
  currentLevel: number
  totalPurchases: number
  totalSpent: number
  referrals: number
  reviewsWritten: number
  daysActive: number
}

const loyaltyLevels: LoyaltyLevel[] = [
  {
    level: 1,
    name: "Découvreur",
    minPoints: 0,
    maxPoints: 499,
    benefits: ["Livraison standard gratuite", "Support prioritaire"],
    color: "text-gray-600",
    icon: <Star className="w-5 h-5" />,
  },
  {
    level: 2,
    name: "Explorateur",
    minPoints: 500,
    maxPoints: 1499,
    benefits: ["Livraison express gratuite", "Accès aux ventes privées", "5% de cashback"],
    color: "text-blue-600",
    icon: <Target className="w-5 h-5" />,
  },
  {
    level: 3,
    name: "Aventurier",
    minPoints: 1500,
    maxPoints: 3999,
    benefits: ["Livraison express gratuite", "10% de cashback", "Cadeaux exclusifs"],
    color: "text-purple-600",
    icon: <Award className="w-5 h-5" />,
  },
  {
    level: 4,
    name: "Champion",
    minPoints: 4000,
    maxPoints: 9999,
    benefits: ["Livraison premium gratuite", "15% de cashback", "Concierge personnel"],
    color: "text-orange-600",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    level: 5,
    name: "Légende",
    minPoints: 10000,
    maxPoints: Number.POSITIVE_INFINITY,
    benefits: ["Tous les avantages", "20% de cashback", "Accès VIP", "Produits exclusifs"],
    color: "text-yellow-600",
    icon: <Crown className="w-5 h-5" />,
  },
]

const achievements: Achievement[] = [
  {
    id: "first_purchase",
    title: "Premier Achat",
    description: "Effectuez votre premier achat",
    icon: <ShoppingBag className="w-6 h-6" />,
    points: 100,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    category: "shopping",
  },
  {
    id: "big_spender",
    title: "Gros Dépensier",
    description: "Dépensez plus de 1000€",
    icon: <TrendingUp className="w-6 h-6" />,
    points: 500,
    unlocked: false,
    progress: 750,
    maxProgress: 1000,
    rarity: "rare",
    category: "shopping",
  },
  {
    id: "social_butterfly",
    title: "Papillon Social",
    description: "Parrainez 5 amis",
    icon: <Users className="w-6 h-6" />,
    points: 300,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: "epic",
    category: "social",
  },
  {
    id: "reviewer",
    title: "Critique Expert",
    description: "Écrivez 10 avis produits",
    icon: <Heart className="w-6 h-6" />,
    points: 200,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: "rare",
    category: "social",
  },
]

export function LoyaltySystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 2750,
    currentLevel: 2,
    totalPurchases: 15,
    totalSpent: 1250.5,
    referrals: 2,
    reviewsWritten: 7,
    daysActive: 45,
  })

  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  const currentLevel = loyaltyLevels[userStats.currentLevel - 1]
  const nextLevel = loyaltyLevels[userStats.currentLevel]
  const progressToNext = nextLevel
    ? ((userStats.totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50"
      case "rare":
        return "border-blue-300 bg-blue-50"
      case "epic":
        return "border-purple-300 bg-purple-50"
      case "legendary":
        return "border-yellow-300 bg-yellow-50"
    }
  }

  const getRarityBadgeColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  // Simuler l'obtention d'un achievement
  const triggerAchievement = (achievement: Achievement) => {
    setNewAchievement(achievement)
    setTimeout(() => setNewAchievement(null), 5000)
  }

  return (
    <div className="space-y-6">
      {/* Notification d'achievement */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                    {newAchievement.icon}
                  </div>
                  <div>
                    <div className="font-bold text-yellow-800">Achievement Débloqué!</div>
                    <div className="text-sm text-yellow-700">{newAchievement.title}</div>
                    <div className="text-xs text-yellow-600">+{newAchievement.points} points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Niveau actuel et progression */}
      <Card className="overflow-hidden">
        <CardHeader className={cn("text-white", currentLevel.color.replace("text-", "bg-"))}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentLevel.icon}
              <div>
                <CardTitle className="text-white">
                  Niveau {currentLevel.level}: {currentLevel.name}
                </CardTitle>
                <p className="text-white/80">{userStats.totalPoints.toLocaleString()} points</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{userStats.totalPoints}</div>
              <div className="text-white/80 text-sm">points totaux</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {nextLevel && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progression vers {nextLevel.name}</span>
                <span>{nextLevel.minPoints - userStats.totalPoints} points restants</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats.totalPurchases}</div>
              <div className="text-sm text-muted-foreground">Achats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats.totalSpent.toFixed(2)}€</div>
              <div className="text-sm text-muted-foreground">Dépensé</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats.referrals}</div>
              <div className="text-sm text-muted-foreground">Parrainages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userStats.daysActive}</div>
              <div className="text-sm text-muted-foreground">Jours actifs</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Avantages actuels:</h4>
            <div className="flex flex-wrap gap-2">
              {currentLevel.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAchievements(!showAchievements)}>
              {showAchievements ? "Masquer" : "Voir tout"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, showAchievements ? achievements.length : 4).map((achievement) => (
              <motion.div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200",
                  getRarityColor(achievement.rarity),
                  achievement.unlocked ? "opacity-100" : "opacity-60",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      achievement.unlocked ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400",
                    )}
                  >
                    {achievement.unlocked ? <Sparkles className="w-6 h-6" /> : achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge className={cn("text-xs", getRarityBadgeColor(achievement.rarity))}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                      <div className="text-sm font-semibold text-primary">+{achievement.points} pts</div>
                    </div>
                    {!achievement.unlocked && (
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2 mt-2" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-semibold mb-1">Récompenses</h4>
            <p className="text-sm text-muted-foreground">Échangez vos points</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-semibold mb-1">Parrainage</h4>
            <p className="text-sm text-muted-foreground">Invitez vos amis</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
            <h4 className="font-semibold mb-1">Défis</h4>
            <p className="text-sm text-muted-foreground">Relevez les défis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
