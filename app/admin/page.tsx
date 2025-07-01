import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  RefreshCw,
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { mockData, getConnectionStatus, queryData } from "@/lib/supabase"
import Link from "next/link"
import { RealTimeLogs } from "./components/real-time-logs"

async function getDashboardStats() {
  return await queryData(mockData.dashboardStats)
}

async function getRecentActivity() {
  return await queryData({
    syncs: mockData.recentSyncs,
    orders: mockData.recentOrders,
    topProducts: mockData.topProducts,
  })
}

function DashboardContent() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}

async function DashboardData() {
  const [stats, activity] = await Promise.all([getDashboardStats(), getRecentActivity()])
  const connectionStatus = getConnectionStatus()

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Indicateur de statut */}
      {connectionStatus.isDemoMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Mode Démonstration</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Application fonctionnelle avec données de démonstration. {connectionStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Tableau de bord</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de votre plateforme de dropshipping</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync globale
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/fournisseurs/ajouter">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau fournisseur
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Chiffre d'affaires</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.orders.revenue.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
            </div>
            <div className="flex items-center mt-2">
              {stats.orders.revenueGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${stats.orders.revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}
              >
                {stats.orders.revenueGrowth > 0 ? "+" : ""}
                {stats.orders.revenueGrowth}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Commandes</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.orders.total}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                {stats.orders.growth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stats.orders.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                  {stats.orders.growth > 0 ? "+" : ""}
                  {stats.orders.growth}%
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.orders.pending} en attente
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Produits actifs</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.products.active}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                {stats.products.growth > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${stats.products.growth > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.products.growth > 0 ? "+" : ""}
                  {stats.products.growth}%
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {stats.products.newThisWeek} nouveaux
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Nouveaux clients</CardTitle>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.users.new}</div>
            <div className="flex items-center mt-2">
              {stats.users.growth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stats.users.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.users.growth > 0 ? "+" : ""}
                {stats.users.growth}%
              </span>
              <span className="text-xs text-gray-500 ml-1">ce mois</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-transform">
              <Link href="/admin/fournisseurs/ajouter">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Ajouter un fournisseur</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/admin/produits">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">Gérer les produits</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/admin/commandes">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">Voir les commandes</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto p-6 flex-col gap-3 hover:scale-105 transition-transform bg-transparent"
            >
              <Link href="/admin/parametres">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium">Paramètres</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Logs */}
      <div className="lg:col-span-2">
        <RealTimeLogs />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return <DashboardContent />
}
