import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Users, TrendingUp, Send, Eye, MousePointer, Plus, BarChart3, Target, Megaphone } from "lucide-react"
import Link from "next/link"

const campaigns = [
  {
    id: 1,
    name: "Promotion Été 2024",
    type: "email",
    status: "active",
    sent: 15420,
    opened: 8234,
    clicked: 1247,
    revenue: 12450,
    created_at: "2024-01-15",
    end_date: "2024-02-15",
  },
  {
    id: 2,
    name: "Nouveaux Produits",
    type: "newsletter",
    status: "draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    revenue: 0,
    created_at: "2024-01-20",
    end_date: "2024-02-20",
  },
  {
    id: 3,
    name: "Panier Abandonné",
    type: "automation",
    status: "active",
    sent: 3420,
    opened: 1834,
    clicked: 567,
    revenue: 8920,
    created_at: "2024-01-10",
    end_date: null,
  },
]

const segments = [
  { name: "Nouveaux clients", count: 1234, growth: "+12%" },
  { name: "Clients fidèles", count: 856, growth: "+8%" },
  { name: "Panier abandonné", count: 432, growth: "-5%" },
  { name: "Inactifs", count: 678, growth: "+3%" },
]

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Marketing</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos campagnes et automatisations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/marketing/campagnes/nouvelle">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle campagne
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails envoyés</p>
                <h3 className="text-2xl font-bold">18,840</h3>
                <p className="text-xs text-green-600">+15% ce mois</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux d'ouverture</p>
                <h3 className="text-2xl font-bold">53.4%</h3>
                <p className="text-xs text-green-600">+2.1% ce mois</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de clic</p>
                <h3 className="text-2xl font-bold">12.8%</h3>
                <p className="text-xs text-green-600">+1.3% ce mois</p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus générés</p>
                <h3 className="text-2xl font-bold">€21,370</h3>
                <p className="text-xs text-green-600">+18% ce mois</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campagnes récentes</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/marketing/campagnes">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status === "active"
                              ? "Active"
                              : campaign.status === "draft"
                                ? "Brouillon"
                                : "Terminée"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {campaign.type === "email"
                              ? "Email"
                              : campaign.type === "newsletter"
                                ? "Newsletter"
                                : "Automatisation"}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {campaign.sent > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Envoyés</p>
                          <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Ouverts</p>
                          <p className="font-medium">
                            {campaign.opened.toLocaleString()}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clics</p>
                          <p className="font-medium">
                            {campaign.clicked.toLocaleString()}
                            <span className="text-xs text-muted-foreground ml-1">
                              ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenus</p>
                          <p className="font-medium text-green-600">€{campaign.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {campaign.status === "draft" && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Send className="h-3 w-3 mr-1" />
                            Envoyer
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segments */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Segments clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{segment.name}</p>
                      <p className="text-sm text-muted-foreground">{segment.count.toLocaleString()} clients</p>
                    </div>
                    <Badge variant={segment.growth.startsWith("+") ? "default" : "destructive"}>{segment.growth}</Badge>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/admin/marketing/segments">Gérer les segments</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/marketing/automatisations">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Automatisations
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/marketing/templates">
                    <Mail className="h-4 w-4 mr-2" />
                    Templates email
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/marketing/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/marketing/promotions">
                    <Megaphone className="h-4 w-4 mr-2" />
                    Promotions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
