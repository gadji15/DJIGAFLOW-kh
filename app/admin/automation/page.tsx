"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Clock,
  Play,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Mail,
  Users,
  Package,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Activity,
  FileText,
  Download,
  Shield,
  Eye,
  Layers,
  Workflow,
} from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  category: "marketing" | "inventory" | "customer" | "analytics" | "security" | "content"
  trigger: {
    type: string
    conditions: any[]
  }
  actions: {
    type: string
    parameters: any
  }[]
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  successRate: number
  createdAt: Date
  updatedAt: Date
  priority: "low" | "medium" | "high" | "critical"
  schedule?: {
    type: "immediate" | "scheduled" | "recurring"
    cron?: string
    timezone: string
  }
}

const mockAutomations: AutomationRule[] = [
  {
    id: "1",
    name: "Email de bienvenue automatique",
    description: "Envoie un email de bienvenue aux nouveaux utilisateurs inscrits",
    category: "marketing",
    trigger: {
      type: "user_registered",
      conditions: [{ field: "email_verified", operator: "equals", value: true }],
    },
    actions: [
      {
        type: "send_email",
        parameters: {
          template: "welcome_email",
          delay: 0,
        },
      },
      {
        type: "add_to_segment",
        parameters: {
          segment: "new_users",
        },
      },
    ],
    isActive: true,
    lastRun: new Date("2024-01-20T10:30:00"),
    nextRun: undefined,
    runCount: 1247,
    successRate: 98.5,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    priority: "high",
    schedule: {
      type: "immediate",
      timezone: "Europe/Paris",
    },
  },
  {
    id: "2",
    name: "Synchronisation stock fournisseurs",
    description: "Met à jour automatiquement les stocks depuis les fournisseurs",
    category: "inventory",
    trigger: {
      type: "scheduled",
      conditions: [],
    },
    actions: [
      {
        type: "sync_supplier_inventory",
        parameters: {
          suppliers: ["aliexpress", "jumia"],
          update_prices: true,
        },
      },
      {
        type: "update_product_status",
        parameters: {
          out_of_stock_action: "hide",
        },
      },
    ],
    isActive: true,
    lastRun: new Date("2024-01-20T06:00:00"),
    nextRun: new Date("2024-01-21T06:00:00"),
    runCount: 45,
    successRate: 94.2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
    priority: "critical",
    schedule: {
      type: "recurring",
      cron: "0 6 * * *",
      timezone: "Europe/Paris",
    },
  },
  {
    id: "3",
    name: "Relance panier abandonné",
    description: "Envoie des emails de relance pour les paniers abandonnés",
    category: "marketing",
    trigger: {
      type: "cart_abandoned",
      conditions: [
        { field: "cart_value", operator: "greater_than", value: 50 },
        { field: "time_since_abandon", operator: "greater_than", value: 3600 },
      ],
    },
    actions: [
      {
        type: "send_email",
        parameters: {
          template: "cart_abandonment_1",
          delay: 3600,
        },
      },
      {
        type: "send_email",
        parameters: {
          template: "cart_abandonment_2",
          delay: 86400,
        },
      },
      {
        type: "create_discount",
        parameters: {
          type: "percentage",
          value: 10,
          expires_in: 604800,
        },
      },
    ],
    isActive: true,
    lastRun: new Date("2024-01-20T14:15:00"),
    nextRun: undefined,
    runCount: 892,
    successRate: 87.3,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-18"),
    priority: "medium",
    schedule: {
      type: "immediate",
      timezone: "Europe/Paris",
    },
  },
  {
    id: "4",
    name: "Analyse de performance quotidienne",
    description: "Génère et envoie un rapport de performance quotidien",
    category: "analytics",
    trigger: {
      type: "scheduled",
      conditions: [],
    },
    actions: [
      {
        type: "generate_report",
        parameters: {
          type: "daily_performance",
          metrics: ["sales", "traffic", "conversion"],
        },
      },
      {
        type: "send_email",
        parameters: {
          template: "daily_report",
          recipients: ["admin@djigaflow.com"],
        },
      },
    ],
    isActive: true,
    lastRun: new Date("2024-01-20T08:00:00"),
    nextRun: new Date("2024-01-21T08:00:00"),
    runCount: 20,
    successRate: 100,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
    priority: "low",
    schedule: {
      type: "recurring",
      cron: "0 8 * * *",
      timezone: "Europe/Paris",
    },
  },
  {
    id: "5",
    name: "Détection fraude commandes",
    description: "Détecte automatiquement les commandes suspectes",
    category: "security",
    trigger: {
      type: "order_placed",
      conditions: [
        { field: "order_value", operator: "greater_than", value: 500 },
        { field: "customer_orders_count", operator: "equals", value: 0 },
      ],
    },
    actions: [
      {
        type: "flag_order",
        parameters: {
          flag: "potential_fraud",
          hold_fulfillment: true,
        },
      },
      {
        type: "send_notification",
        parameters: {
          type: "admin_alert",
          message: "Commande suspecte détectée",
        },
      },
    ],
    isActive: true,
    lastRun: new Date("2024-01-20T16:45:00"),
    nextRun: undefined,
    runCount: 23,
    successRate: 91.3,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-12"),
    priority: "critical",
    schedule: {
      type: "immediate",
      timezone: "Europe/Paris",
    },
  },
]

const categoryIcons = {
  marketing: Mail,
  inventory: Package,
  customer: Users,
  analytics: BarChart3,
  security: Shield,
  content: FileText,
}

const categoryColors = {
  marketing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  inventory: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  customer: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  analytics: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  security: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  content: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

export default function AutomationDashboard() {
  const [automations, setAutomations] = useState<AutomationRule[]>(mockAutomations)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreating, setIsCreating] = useState(false)

  // Statistiques
  const totalAutomations = automations.length
  const activeAutomations = automations.filter((a) => a.isActive).length
  const totalRuns = automations.reduce((sum, a) => sum + a.runCount, 0)
  const avgSuccessRate = automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length

  // Filtrer les automations
  const filteredAutomations = automations.filter((automation) => {
    const categoryMatch = selectedCategory === "all" || automation.category === selectedCategory
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "active" && automation.isActive) ||
      (selectedStatus === "inactive" && !automation.isActive)

    return categoryMatch && statusMatch
  })

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((automation) => (automation.id === id ? { ...automation, isActive: !automation.isActive } : automation)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Automatisation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Automatisez vos tâches répétitives et optimisez vos workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle automatisation
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total automatisations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalAutomations}</p>
              </div>
              <Workflow className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actives</p>
                <p className="text-2xl font-bold text-green-600">{activeAutomations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exécutions totales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRuns.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taux de succès</p>
                <p className="text-2xl font-bold text-orange-600">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="inventory">Inventaire</SelectItem>
                  <SelectItem value="customer">Client</SelectItem>
                  <SelectItem value="analytics">Analytique</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="content">Contenu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="inactive">Inactives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des automatisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredAutomations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onToggle={() => toggleAutomation(automation.id)}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Templates d'automatisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Templates d'automatisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Email de bienvenue",
                description: "Accueillez automatiquement vos nouveaux clients",
                category: "marketing",
                icon: Mail,
              },
              {
                name: "Synchronisation stock",
                description: "Maintenez vos stocks à jour automatiquement",
                category: "inventory",
                icon: Package,
              },
              {
                name: "Segmentation clients",
                description: "Classez automatiquement vos clients par comportement",
                category: "customer",
                icon: Users,
              },
              {
                name: "Rapports automatiques",
                description: "Recevez des rapports de performance réguliers",
                category: "analytics",
                icon: BarChart3,
              },
              {
                name: "Détection de fraude",
                description: "Identifiez automatiquement les transactions suspectes",
                category: "security",
                icon: Shield,
              },
              {
                name: "Publication de contenu",
                description: "Programmez et publiez votre contenu automatiquement",
                category: "content",
                icon: FileText,
              },
            ].map((template) => {
              const Icon = template.icon
              return (
                <motion.div key={template.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                          <Badge
                            className={cn(
                              "mt-2 text-xs",
                              categoryColors[template.category as keyof typeof categoryColors],
                            )}
                          >
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant pour chaque carte d'automatisation
function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onDelete,
}: {
  automation: AutomationRule
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const CategoryIcon = categoryIcons[automation.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <CategoryIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{automation.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{automation.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={automation.isActive} onCheckedChange={onToggle} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={cn("text-xs", categoryColors[automation.category])}>{automation.category}</Badge>
              <Badge className={cn("text-xs", priorityColors[automation.priority])}>{automation.priority}</Badge>
              {automation.schedule?.type === "recurring" && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Récurrent
                </Badge>
              )}
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Exécutions</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {automation.runCount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Succès</div>
                <div className="text-lg font-semibold text-green-600">{automation.successRate.toFixed(1)}%</div>
              </div>
            </div>

            {/* Barre de progression du taux de succès */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Taux de succès</span>
                <span>{automation.successRate.toFixed(1)}%</span>
              </div>
              <Progress value={automation.successRate} className="h-2" />
            </div>

            {/* Dernière exécution */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {automation.lastRun && <div>Dernière exécution: {automation.lastRun.toLocaleString()}</div>}
              {automation.nextRun && <div>Prochaine exécution: {automation.nextRun.toLocaleString()}</div>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                Logs
              </Button>
              <Button variant="ghost" size="sm">
                <Play className="h-3 w-3 mr-1" />
                Tester
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
