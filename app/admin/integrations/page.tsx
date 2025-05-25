"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  RefreshCw,
  ExternalLink,
  Key,
  Mail,
  CreditCard,
  BarChart3,
  MessageSquare,
  Globe,
  Users,
  FileText,
  Cloud,
  Lock,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: "crm" | "payment" | "marketing" | "analytics" | "communication" | "storage" | "security"
  provider: string
  status: "connected" | "disconnected" | "error" | "pending"
  icon: any
  color: string
  features: string[]
  config: Record<string, any>
  lastSync?: Date
  syncFrequency?: string
  apiVersion?: string
  webhookUrl?: string
  isActive: boolean
  connectedAt?: Date
  errorMessage?: string
}

const mockIntegrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Passerelle de paiement sécurisée pour traiter les transactions",
    category: "payment",
    provider: "Stripe Inc.",
    status: "connected",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-800",
    features: ["Paiements par carte", "Abonnements", "Remboursements", "Webhooks"],
    config: {
      publicKey: "pk_test_***",
      secretKey: "sk_test_***",
      webhookSecret: "whsec_***",
    },
    lastSync: new Date("2024-01-20T14:30:00"),
    syncFrequency: "real-time",
    apiVersion: "2023-10-16",
    webhookUrl: "https://djigaflow.com/api/webhooks/stripe",
    isActive: true,
    connectedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Plateforme d'email marketing et d'automatisation",
    category: "marketing",
    provider: "Intuit Mailchimp",
    status: "connected",
    icon: Mail,
    color: "bg-yellow-100 text-yellow-800",
    features: ["Email campaigns", "Automation", "Segmentation", "Analytics"],
    config: {
      apiKey: "abc123-***",
      listId: "def456",
      dataCenter: "us1",
    },
    lastSync: new Date("2024-01-20T12:00:00"),
    syncFrequency: "hourly",
    apiVersion: "3.0",
    isActive: true,
    connectedAt: new Date("2024-01-10T14:30:00"),
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    description: "Système de gestion de la relation client",
    category: "crm",
    provider: "HubSpot Inc.",
    status: "error",
    icon: Users,
    color: "bg-orange-100 text-orange-800",
    features: ["Contact management", "Deal tracking", "Email integration", "Reports"],
    config: {
      apiKey: "hub_***",
      portalId: "12345",
    },
    lastSync: new Date("2024-01-19T08:00:00"),
    syncFrequency: "daily",
    apiVersion: "v3",
    isActive: false,
    connectedAt: new Date("2024-01-05T16:20:00"),
    errorMessage: "API key expired - Please renew your authentication",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Analyse du trafic et du comportement des utilisateurs",
    category: "analytics",
    provider: "Google LLC",
    status: "connected",
    icon: BarChart3,
    color: "bg-green-100 text-green-800",
    features: ["Traffic analysis", "Conversion tracking", "Custom reports", "Real-time data"],
    config: {
      trackingId: "GA-***",
      propertyId: "G-***",
    },
    lastSync: new Date("2024-01-20T15:00:00"),
    syncFrequency: "real-time",
    apiVersion: "GA4",
    isActive: true,
    connectedAt: new Date("2024-01-01T12:00:00"),
  },
  {
    id: "slack",
    name: "Slack",
    description: "Communication d'équipe et notifications",
    category: "communication",
    provider: "Slack Technologies",
    status: "disconnected",
    icon: MessageSquare,
    color: "bg-purple-100 text-purple-800",
    features: ["Team messaging", "Notifications", "File sharing", "Integrations"],
    config: {},
    isActive: false,
  },
  {
    id: "aws-s3",
    name: "Amazon S3",
    description: "Stockage cloud pour fichiers et médias",
    category: "storage",
    provider: "Amazon Web Services",
    status: "connected",
    icon: Cloud,
    color: "bg-gray-100 text-gray-800",
    features: ["File storage", "CDN", "Backup", "Media optimization"],
    config: {
      accessKey: "AKIA***",
      secretKey: "***",
      bucket: "djigaflow-assets",
      region: "eu-west-1",
    },
    lastSync: new Date("2024-01-20T16:00:00"),
    syncFrequency: "continuous",
    isActive: true,
    connectedAt: new Date("2023-12-15T09:30:00"),
  },
]

const categoryIcons = {
  crm: Users,
  payment: CreditCard,
  marketing: Mail,
  analytics: BarChart3,
  communication: MessageSquare,
  storage: Cloud,
  security: Lock,
}

const statusColors = {
  connected: "bg-green-100 text-green-800",
  disconnected: "bg-gray-100 text-gray-800",
  error: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

const statusIcons = {
  connected: CheckCircle,
  disconnected: XCircle,
  error: AlertTriangle,
  pending: RefreshCw,
}

export default function IntegrationsManagement() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Statistiques
  const connectedIntegrations = integrations.filter((i) => i.status === "connected").length
  const errorIntegrations = integrations.filter((i) => i.status === "error").length
  const totalIntegrations = integrations.length

  // Filtrer par catégorie
  const filteredIntegrations =
    selectedCategory === "all" ? integrations : integrations.filter((i) => i.category === selectedCategory)

  // Grouper par catégorie
  const integrationsByCategory = integrations.reduce(
    (acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = []
      }
      acc[integration.category].push(integration)
      return acc
    },
    {} as Record<string, Integration[]>,
  )

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, isActive: !integration.isActive } : integration,
      ),
    )
  }

  const syncIntegration = async (id: string) => {
    // Simulation de synchronisation
    setIntegrations((prev) =>
      prev.map((integration) => (integration.id === id ? { ...integration, lastSync: new Date() } : integration)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Intégrations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connectez et gérez vos services tiers pour automatiser vos workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Webhooks
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle intégration
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total intégrations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalIntegrations}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Connectées</p>
                <p className="text-2xl font-bold text-green-600">{connectedIntegrations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Erreurs</p>
                <p className="text-2xl font-bold text-red-600">{errorIntegrations}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Santé globale</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((connectedIntegrations / totalIntegrations) * 100)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Label htmlFor="category">Catégorie:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                    <SelectItem value="payment">Paiement</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="storage">Stockage</SelectItem>
                    <SelectItem value="security">Sécurité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Intégrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onToggle={() => toggleIntegration(integration.id)}
                onSync={() => syncIntegration(integration.id)}
                onConfigure={() => {
                  setSelectedIntegration(integration)
                  setIsConfigDialogOpen(true)
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Marketplace des intégrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(integrationsByCategory).map(([category, categoryIntegrations]) => {
                  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <Card key={category} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <CategoryIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{category}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {categoryIntegrations.length} intégrations
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {categoryIntegrations.slice(0, 3).map((integration) => (
                            <div key={integration.id} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{integration.name}</span>
                              <Badge className={statusColors[integration.status]}>{integration.status}</Badge>
                            </div>
                          ))}
                          {categoryIntegrations.length > 3 && (
                            <p className="text-xs text-gray-500">+{categoryIntegrations.length - 3} autres</p>
                          )}
                        </div>

                        <Button className="w-full mt-4" variant="outline">
                          Voir toutes
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuration des Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations
                  .filter((i) => i.webhookUrl)
                  .map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <integration.icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{integration.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{integration.webhookUrl}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[integration.status]}>{integration.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs d'intégration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    timestamp: new Date("2024-01-20T15:30:00"),
                    integration: "Stripe",
                    event: "Payment processed",
                    status: "success",
                    details: "Payment of €89.99 processed successfully",
                  },
                  {
                    timestamp: new Date("2024-01-20T15:25:00"),
                    integration: "Mailchimp",
                    event: "Contact synchronized",
                    status: "success",
                    details: "New contact added to mailing list",
                  },
                  {
                    timestamp: new Date("2024-01-20T15:20:00"),
                    integration: "HubSpot CRM",
                    event: "Sync failed",
                    status: "error",
                    details: "API key expired - authentication required",
                  },
                ].map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        log.status === "success"
                          ? "bg-green-500"
                          : log.status === "error"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{log.integration}</span>
                        <span className="text-sm text-gray-500">{log.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{log.event}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de configuration */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configuration - {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Configurez les paramètres de l'intégration {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <IntegrationConfigForm
              integration={selectedIntegration}
              onSave={() => setIsConfigDialogOpen(false)}
              onCancel={() => setIsConfigDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant carte d'intégration
function IntegrationCard({
  integration,
  onToggle,
  onSync,
  onConfigure,
}: {
  integration: Integration
  onToggle: () => void
  onSync: () => void
  onConfigure: () => void
}) {
  const StatusIcon = statusIcons[integration.status]

  return (
    <motion.div whileHover={{ y: -2 }} className="group">
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center`}>
                <integration.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{integration.provider}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[integration.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {integration.status}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{integration.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Statut</span>
              <Switch
                checked={integration.isActive}
                onCheckedChange={onToggle}
                disabled={integration.status === "error"}
              />
            </div>

            {integration.lastSync && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Dernière sync</span>
                <span className="text-sm font-medium">{integration.lastSync.toLocaleString()}</span>
              </div>
            )}

            {integration.syncFrequency && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Fréquence</span>
                <Badge variant="outline" className="text-xs">
                  {integration.syncFrequency}
                </Badge>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-3">
              {integration.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {integration.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{integration.features.length - 3}
                </Badge>
              )}
            </div>

            {integration.errorMessage && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800 dark:text-red-200">{integration.errorMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button size="sm" variant="outline" onClick={onConfigure}>
              <Settings className="h-3 w-3 mr-1" />
              Configurer
            </Button>
            {integration.status === "connected" && (
              <Button size="sm" variant="outline" onClick={onSync}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync
              </Button>
            )}
            <Button size="sm" variant="outline">
              <ExternalLink className="h-3 w-3 mr-1" />
              Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Composant formulaire de configuration d'intégration
function IntegrationConfigForm({
  integration,
  onSave,
  onCancel,
}: {
  integration: Integration
  onSave: () => void
  onCancel: () => void
}) {
  const [config, setConfig] = useState(integration.config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous ajouteriez la logique de sauvegarde
    onSave()
  }

  const renderConfigField = (key: string, value: any) => {
    const isSecret = key.toLowerCase().includes("secret") || key.toLowerCase().includes("key")

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="capitalize">
          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
        </Label>
        <Input
          id={key}
          type={isSecret ? "password" : "text"}
          value={value}
          onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
          placeholder={isSecret ? "••••••••" : `Entrez ${key}`}
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(config).map(([key, value]) => renderConfigField(key, value))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paramètres avancés</h3>

        <div className="space-y-2">
          <Label htmlFor="syncFrequency">Fréquence de synchronisation</Label>
          <Select defaultValue={integration.syncFrequency || "hourly"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="real-time">Temps réel</SelectItem>
              <SelectItem value="hourly">Toutes les heures</SelectItem>
              <SelectItem value="daily">Quotidienne</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="manual">Manuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {integration.webhookUrl && (
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">URL Webhook</Label>
            <Input id="webhookUrl" value={integration.webhookUrl} readOnly className="bg-gray-50 dark:bg-gray-800" />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Sauvegarder</Button>
      </DialogFooter>
    </form>
  )
}
