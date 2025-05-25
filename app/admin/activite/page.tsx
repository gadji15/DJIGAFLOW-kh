import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Package, ShoppingCart, Users, Settings, RefreshCw, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "order",
    action: "created",
    user: "Marie Dubois",
    target: "Commande #12345",
    description: "Nouvelle commande de 299.99€",
    timestamp: "Il y a 2 minutes",
    icon: ShoppingCart,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "product",
    action: "updated",
    user: "Admin",
    target: "iPhone 15 Pro",
    description: "Prix mis à jour: 1199€ → 1099€",
    timestamp: "Il y a 15 minutes",
    icon: Package,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "user",
    action: "registered",
    user: "Jean Martin",
    target: "Nouveau compte",
    description: "Inscription depuis la page d'accueil",
    timestamp: "Il y a 1 heure",
    icon: Users,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "system",
    action: "sync",
    user: "Système",
    target: "Fournisseur AliExpress",
    description: "Synchronisation de 156 produits",
    timestamp: "Il y a 2 heures",
    icon: RefreshCw,
    color: "text-orange-600",
  },
  {
    id: 5,
    type: "settings",
    action: "updated",
    user: "Admin",
    target: "Paramètres email",
    description: "Configuration SMTP mise à jour",
    timestamp: "Il y a 3 heures",
    icon: Settings,
    color: "text-gray-600",
  },
]

const stats = [
  { label: "Actions aujourd'hui", value: "47", change: "+12%", icon: Activity },
  { label: "Utilisateurs actifs", value: "23", change: "+8%", icon: Users },
  { label: "Commandes traitées", value: "15", change: "+25%", icon: ShoppingCart },
  { label: "Produits modifiés", value: "8", change: "-5%", icon: Package },
]

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Activité récente</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivez toutes les actions sur votre plateforme</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith("+")
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>{stat.change} vs hier</p>
                  </div>
                  <Icon className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Flux d'activité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${activity.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{activity.user}</p>
                      <Badge variant="outline" className="text-xs">
                        {activity.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{activity.target}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
