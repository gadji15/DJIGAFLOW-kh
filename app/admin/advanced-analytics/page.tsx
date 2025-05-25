"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
  Target,
  Zap,
  Download,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react"

interface AnalyticsData {
  period: string
  metrics: {
    revenue: number
    orders: number
    visitors: number
    conversionRate: number
    avgOrderValue: number
    bounceRate: number
    pageViews: number
    sessionDuration: number
  }
  trends: {
    revenue: number
    orders: number
    visitors: number
    conversionRate: number
  }
  topPages: Array<{
    page: string
    views: number
    uniqueViews: number
    bounceRate: number
    avgTime: number
  }>
  userBehavior: {
    deviceBreakdown: Array<{ device: string; percentage: number; sessions: number }>
    trafficSources: Array<{ source: string; percentage: number; visitors: number }>
    geographicData: Array<{ country: string; visitors: number; revenue: number }>
  }
  conversionFunnel: Array<{
    stage: string
    visitors: number
    conversionRate: number
    dropOffRate: number
  }>
  cohortAnalysis: Array<{
    cohort: string
    week0: number
    week1: number
    week2: number
    week3: number
    week4: number
  }>
}

const mockAnalyticsData: AnalyticsData = {
  period: "last_30_days",
  metrics: {
    revenue: 125430,
    orders: 1247,
    visitors: 45230,
    conversionRate: 2.76,
    avgOrderValue: 100.58,
    bounceRate: 34.2,
    pageViews: 156780,
    sessionDuration: 245,
  },
  trends: {
    revenue: 15.3,
    orders: 12.8,
    visitors: 8.7,
    conversionRate: -2.1,
  },
  topPages: [
    { page: "/", views: 23450, uniqueViews: 18230, bounceRate: 28.5, avgTime: 145 },
    { page: "/catalogue", views: 18920, uniqueViews: 15670, bounceRate: 32.1, avgTime: 234 },
    { page: "/produit/iphone-15", views: 12340, uniqueViews: 10890, bounceRate: 45.2, avgTime: 189 },
    { page: "/panier", views: 8760, uniqueViews: 7890, bounceRate: 65.3, avgTime: 98 },
    { page: "/checkout", views: 5430, uniqueViews: 4980, bounceRate: 78.9, avgTime: 156 },
  ],
  userBehavior: {
    deviceBreakdown: [
      { device: "Desktop", percentage: 52.3, sessions: 23670 },
      { device: "Mobile", percentage: 38.7, sessions: 17500 },
      { device: "Tablet", percentage: 9.0, sessions: 4070 },
    ],
    trafficSources: [
      { source: "Recherche organique", percentage: 45.2, visitors: 20454 },
      { source: "Réseaux sociaux", percentage: 28.7, visitors: 12981 },
      { source: "Email marketing", percentage: 15.3, visitors: 6920 },
      { source: "Publicité payante", percentage: 10.8, visitors: 4885 },
    ],
    geographicData: [
      { country: "France", visitors: 28450, revenue: 89230 },
      { country: "Belgique", visitors: 8920, revenue: 23450 },
      { country: "Suisse", visitors: 4560, revenue: 18920 },
      { country: "Canada", visitors: 2340, revenue: 8760 },
      { country: "Allemagne", visitors: 960, revenue: 5070 },
    ],
  },
  conversionFunnel: [
    { stage: "Visiteurs", visitors: 45230, conversionRate: 100, dropOffRate: 0 },
    { stage: "Pages produits", visitors: 23450, conversionRate: 51.8, dropOffRate: 48.2 },
    { stage: "Ajout au panier", visitors: 8760, conversionRate: 19.4, dropOffRate: 62.6 },
    { stage: "Checkout", visitors: 5430, conversionRate: 12.0, dropOffRate: 38.0 },
    { stage: "Commande", visitors: 1247, conversionRate: 2.8, dropOffRate: 77.0 },
  ],
  cohortAnalysis: [
    { cohort: "Jan 2024", week0: 100, week1: 45, week2: 32, week3: 28, week4: 25 },
    { cohort: "Fév 2024", week0: 100, week1: 48, week2: 35, week3: 31, week4: 28 },
    { cohort: "Mar 2024", week0: 100, week1: 52, week2: 38, week3: 34, week4: 30 },
    { cohort: "Avr 2024", week0: 100, week1: 49, week2: 36, week3: 32, week4: 29 },
  ],
}

export default function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [selectedPeriod, setSelectedPeriod] = useState("last_30_days")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Simulation de rechargement des données
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Avancés</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyses approfondies des performances et du comportement utilisateur
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">7 derniers jours</SelectItem>
              <SelectItem value="last_30_days">30 derniers jours</SelectItem>
              <SelectItem value="last_90_days">90 derniers jours</SelectItem>
              <SelectItem value="last_year">Dernière année</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Revenus"
          value={`€${data.metrics.revenue.toLocaleString()}`}
          trend={data.trends.revenue}
          icon={DollarSign}
          color="text-green-600"
        />
        <MetricCard
          title="Commandes"
          value={data.metrics.orders.toLocaleString()}
          trend={data.trends.orders}
          icon={ShoppingCart}
          color="text-blue-600"
        />
        <MetricCard
          title="Visiteurs"
          value={data.metrics.visitors.toLocaleString()}
          trend={data.trends.visitors}
          icon={Users}
          color="text-purple-600"
        />
        <MetricCard
          title="Taux de conversion"
          value={`${data.metrics.conversionRate}%`}
          trend={data.trends.conversionRate}
          icon={Target}
          color="text-orange-600"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="cohort">Cohortes</TabsTrigger>
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
          <TabsTrigger value="custom">Personnalisé</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métriques secondaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Panier moyen</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      €{data.metrics.avgOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de rebond</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.metrics.bounceRate}%</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages vues</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {data.metrics.pageViews.toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Durée session</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {Math.floor(data.metrics.sessionDuration / 60)}m {data.metrics.sessionDuration % 60}s
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pages les plus visitées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Pages les plus visitées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{page.page}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {page.views.toLocaleString()} vues • {page.uniqueViews.toLocaleString()} uniques
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{page.bounceRate}%</div>
                        <div className="text-gray-500">Rebond</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{page.avgTime}s</div>
                        <div className="text-gray-500">Temps moyen</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par appareil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Répartition par appareil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userBehavior.deviceBreakdown.map((device) => {
                    const Icon =
                      device.device === "Desktop" ? Monitor : device.device === "Mobile" ? Smartphone : Monitor
                    return (
                      <div key={device.device} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-600" />
                            <span className="font-medium">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{device.percentage}%</div>
                            <div className="text-sm text-gray-500">{device.sessions.toLocaleString()} sessions</div>
                          </div>
                        </div>
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sources de trafic */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Sources de trafic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userBehavior.trafficSources.map((source) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{source.source}</span>
                        <div className="text-right">
                          <div className="font-medium">{source.percentage}%</div>
                          <div className="text-sm text-gray-500">{source.visitors.toLocaleString()} visiteurs</div>
                        </div>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Données géographiques */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Répartition géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.userBehavior.geographicData.map((country) => (
                    <div key={country.country} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{country.country}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Visiteurs</span>
                          <span className="font-medium">{country.visitors.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Revenus</span>
                          <span className="font-medium">€{country.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Entonnoir de conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.conversionFunnel.map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{stage.stage}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stage.visitors.toLocaleString()} utilisateurs
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{stage.conversionRate.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">Conversion</div>
                        </div>
                        {stage.dropOffRate > 0 && (
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{stage.dropOffRate.toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">Abandon</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Barre de progression visuelle */}
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${stage.conversionRate}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cohort" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Analyse de cohortes - Rétention utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Cohorte</th>
                      <th className="text-center p-4">Semaine 0</th>
                      <th className="text-center p-4">Semaine 1</th>
                      <th className="text-center p-4">Semaine 2</th>
                      <th className="text-center p-4">Semaine 3</th>
                      <th className="text-center p-4">Semaine 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cohortAnalysis.map((cohort) => (
                      <tr key={cohort.cohort} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="p-4 font-medium">{cohort.cohort}</td>
                        <td className="p-4 text-center">
                          <div className="w-12 h-8 mx-auto bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{cohort.week0}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className="w-12 h-8 mx-auto rounded flex items-center justify-center"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${cohort.week1 / 100})`,
                              color: cohort.week1 > 50 ? "white" : "black",
                            }}
                          >
                            <span className="text-sm font-medium">{cohort.week1}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className="w-12 h-8 mx-auto rounded flex items-center justify-center"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${cohort.week2 / 100})`,
                              color: cohort.week2 > 50 ? "white" : "black",
                            }}
                          >
                            <span className="text-sm font-medium">{cohort.week2}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className="w-12 h-8 mx-auto rounded flex items-center justify-center"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${cohort.week3 / 100})`,
                              color: cohort.week3 > 50 ? "white" : "black",
                            }}
                          >
                            <span className="text-sm font-medium">{cohort.week3}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div
                            className="w-12 h-8 mx-auto rounded flex items-center justify-center"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${cohort.week4 / 100})`,
                              color: cohort.week4 > 50 ? "white" : "black",
                            }}
                          >
                            <span className="text-sm font-medium">{cohort.week4}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visiteurs en ligne</p>
                    <p className="text-3xl font-bold text-green-600">247</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages vues/min</p>
                    <p className="text-3xl font-bold text-blue-600">89</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Commandes/heure</p>
                    <p className="text-3xl font-bold text-purple-600">12</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus/heure</p>
                    <p className="text-3xl font-bold text-orange-600">€1,247</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Activité en temps réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "Il y a 2s", event: "Nouvelle commande", details: "iPhone 15 Pro - €1,199", type: "order" },
                  { time: "Il y a 15s", event: "Nouveau visiteur", details: "France - Mobile", type: "visitor" },
                  { time: "Il y a 32s", event: "Ajout au panier", details: "AirPods Pro", type: "cart" },
                  { time: "Il y a 1m", event: "Page vue", details: "/catalogue/smartphones", type: "pageview" },
                  {
                    time: "Il y a 2m",
                    event: "Inscription newsletter",
                    details: "marie.martin@example.com",
                    type: "signup",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "order"
                          ? "bg-green-500"
                          : activity.type === "visitor"
                            ? "bg-blue-500"
                            : activity.type === "cart"
                              ? "bg-purple-500"
                              : activity.type === "pageview"
                                ? "bg-gray-500"
                                : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{activity.event}</span>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Rapport personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Créez votre rapport personnalisé
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sélectionnez les métriques, filtres et dimensions pour créer un rapport sur mesure
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau rapport
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Composant de carte métrique
function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  trend: number
  icon: any
  color: string
}) {
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown
  const trendColor = trend >= 0 ? "text-green-600" : "text-red-600"

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`h-8 w-8 ${color}`} />
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span>{Math.abs(trend)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
