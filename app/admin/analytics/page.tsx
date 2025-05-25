import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"

const kpis = [
  {
    title: "Revenus totaux",
    value: "€45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Visiteurs uniques",
    value: "12,234",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Taux de conversion",
    value: "3.24%",
    change: "-0.5%",
    trend: "down",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Panier moyen",
    value: "€87.50",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-orange-600",
  },
]

const trafficSources = [
  { source: "Recherche organique", visitors: 8420, percentage: 45, color: "bg-blue-500" },
  { source: "Réseaux sociaux", visitors: 3210, percentage: 25, color: "bg-green-500" },
  { source: "Email marketing", visitors: 2340, percentage: 18, color: "bg-purple-500" },
  { source: "Publicité payante", visitors: 1560, percentage: 12, color: "bg-orange-500" },
]

const deviceStats = [
  { device: "Desktop", percentage: 52, icon: Monitor },
  { device: "Mobile", percentage: 38, icon: Smartphone },
  { device: "Tablet", percentage: 10, icon: Tablet },
]

const topPages = [
  { page: "/", views: 15420, bounce_rate: 32 },
  { page: "/catalogue", views: 8930, bounce_rate: 28 },
  { page: "/produit/iphone-15", views: 5670, bounce_rate: 45 },
  { page: "/promotions", views: 4320, bounce_rate: 25 },
  { page: "/panier", views: 3210, bounce_rate: 65 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyses détaillées de votre performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exporter</Button>
          <Button>Rapport personnalisé</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendIcon className="h-4 w-4" />
                    {kpi.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{kpi.value}</h3>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sources de trafic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{source.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{source.visitors.toLocaleString()}</span>
                      <Badge variant="outline">{source.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Répartition par appareil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {deviceStats.map((device) => {
                const Icon = device.icon
                return (
                  <div key={device.device} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{device.device}</span>
                        <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pages les plus visitées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Page</th>
                  <th className="text-left py-3 px-4 font-medium">Vues</th>
                  <th className="text-left py-3 px-4 font-medium">Taux de rebond</th>
                  <th className="text-left py-3 px-4 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page, index) => (
                  <tr key={page.page} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{index + 1}</span>
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{page.page}</code>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{page.views.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={page.bounce_rate > 50 ? "destructive" : "default"}>{page.bounce_rate}%</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Progress value={100 - page.bounce_rate} className="h-2 w-20" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visiteurs en ligne</p>
                <h3 className="text-2xl font-bold">47</h3>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes aujourd'hui</p>
                <h3 className="text-2xl font-bold">23</h3>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus aujourd'hui</p>
                <h3 className="text-2xl font-bold">€1,847</h3>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
