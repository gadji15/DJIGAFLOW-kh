"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Server,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  history: number[]
}

interface ServiceStatus {
  name: string
  status: "online" | "offline" | "degraded"
  uptime: number
  responseTime: number
  lastCheck: Date
  endpoint: string
}

const mockMetrics: SystemMetric[] = [
  {
    name: "CPU Usage",
    value: 45,
    unit: "%",
    status: "healthy",
    trend: "stable",
    history: [42, 38, 45, 41, 39, 45, 43, 45],
  },
  {
    name: "Memory Usage",
    value: 68,
    unit: "%",
    status: "warning",
    trend: "up",
    history: [62, 64, 66, 65, 67, 68, 69, 68],
  },
  {
    name: "Disk Usage",
    value: 34,
    unit: "%",
    status: "healthy",
    trend: "stable",
    history: [32, 33, 34, 33, 34, 35, 34, 34],
  },
  {
    name: "Network I/O",
    value: 156,
    unit: "MB/s",
    status: "healthy",
    trend: "up",
    history: [120, 135, 142, 148, 152, 156, 158, 156],
  },
  {
    name: "Database Connections",
    value: 23,
    unit: "active",
    status: "healthy",
    trend: "stable",
    history: [20, 22, 24, 23, 21, 23, 24, 23],
  },
  {
    name: "API Response Time",
    value: 245,
    unit: "ms",
    status: "healthy",
    trend: "down",
    history: [280, 265, 250, 245, 240, 245, 248, 245],
  },
]

const mockServices: ServiceStatus[] = [
  {
    name: "API Gateway",
    status: "online",
    uptime: 99.9,
    responseTime: 120,
    lastCheck: new Date(),
    endpoint: "/api/health",
  },
  {
    name: "Database",
    status: "online",
    uptime: 99.8,
    responseTime: 45,
    lastCheck: new Date(),
    endpoint: "postgresql://...",
  },
  {
    name: "Redis Cache",
    status: "online",
    uptime: 100,
    responseTime: 12,
    lastCheck: new Date(),
    endpoint: "redis://...",
  },
  {
    name: "Email Service",
    status: "degraded",
    uptime: 98.5,
    responseTime: 890,
    lastCheck: new Date(),
    endpoint: "smtp://...",
  },
  {
    name: "Payment Gateway",
    status: "online",
    uptime: 99.7,
    responseTime: 340,
    lastCheck: new Date(),
    endpoint: "https://api.stripe.com",
  },
  {
    name: "CDN",
    status: "online",
    uptime: 99.9,
    responseTime: 89,
    lastCheck: new Date(),
    endpoint: "https://cdn.djigaflow.com",
  },
]

const statusColors = {
  healthy: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  online: "bg-green-100 text-green-800",
  offline: "bg-red-100 text-red-800",
  degraded: "bg-yellow-100 text-yellow-800",
}

const statusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle,
  online: CheckCircle,
  offline: AlertTriangle,
  degraded: Clock,
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetric[]>(mockMetrics)
  const [services, setServices] = useState<ServiceStatus[]>(mockServices)
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h")
  const [isRealTime, setIsRealTime] = useState(true)
  const [linkStatus, setLinkStatus] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState(null)

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    if (!isRealTime) return

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 5,
          history: [...metric.history.slice(1), metric.value + (Math.random() - 0.5) * 5],
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isRealTime])

  const healthyServices = services.filter((s) => s.status === "online").length
  const totalServices = services.length
  const avgResponseTime = Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)
  const systemHealth = Math.round((healthyServices / totalServices) * 100)

  const fetchLinkStatus = async () => {
    try {
      const response = await fetch("/api/monitor/links")
      const data = await response.json()
      setLinkStatus(data)
      setLastCheck(new Date().toISOString())
    } catch (error) {
      console.error("Erreur lors de la récupération du statut", error)
    }
  }

  const runManualCheck = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/monitor/links", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        console.log("Vérification terminée")
        await fetchLinkStatus()
      } else {
        console.error("Erreur lors de la vérification", data.error)
      }
    } catch (error) {
      console.error("Erreur lors de la vérification", error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    fetchLinkStatus()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLinkStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Surveillez les performances et la santé de votre système en temps réel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{isRealTime ? "Temps réel" : "Pause"}</span>
          </div>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="1h">1 heure</SelectItem>
              <SelectItem value="24h">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsRealTime(!isRealTime)}>
            {isRealTime ? "Pause" : "Reprendre"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={runManualCheck} disabled={isChecking}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Santé du système</p>
                <p className="text-2xl font-bold text-green-600">{systemHealth}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services en ligne</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {healthyServices}/{totalServices}
                </p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temps de réponse moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgResponseTime}ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,247</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Liens cassés</p>
                <p className="text-2xl font-bold text-red-600">{linkStatus?.brokenLinksCount || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Liens valides</p>
                <p className="text-2xl font-bold text-green-600">
                  {linkStatus ? 150 - (linkStatus.brokenLinksCount || 0) : 150}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernière vérif.</p>
                <p className="text-sm font-medium">
                  {lastCheck ? new Date(lastCheck).toLocaleTimeString("fr-FR") : "Jamais"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Santé globale</p>
                <p className="text-2xl font-bold text-green-600">
                  {linkStatus ? Math.round(((150 - (linkStatus.brokenLinksCount || 0)) / 150) * 100) : 100}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => {
              const StatusIcon = statusIcons[metric.status]
              const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Activity

              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{metric.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[metric.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                              {metric.value.toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{metric.unit}</div>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <TrendIcon
                              className={`h-4 w-4 ${
                                metric.trend === "up"
                                  ? "text-green-600"
                                  : metric.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            />
                            <span
                              className={
                                metric.trend === "up"
                                  ? "text-green-600"
                                  : metric.trend === "down"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }
                            >
                              {metric.trend}
                            </span>
                          </div>
                        </div>

                        {/* Mini graphique */}
                        <div className="h-16 flex items-end gap-1">
                          {metric.history.map((value, index) => (
                            <div
                              key={index}
                              className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t"
                              style={{
                                height: `${(value / Math.max(...metric.history)) * 100}%`,
                                minHeight: "2px",
                              }}
                            />
                          ))}
                        </div>

                        {metric.status === "warning" || metric.status === "critical" ? (
                          <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800 dark:text-yellow-200">Surveillance requise</span>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => {
              const StatusIcon = statusIcons[service.status]

              return (
                <Card key={service.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.endpoint}</p>
                      </div>
                      <Badge className={statusColors[service.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {service.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Uptime</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{service.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Réponse</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{service.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Dernière vérif.</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {service.lastCheck.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Uptime</span>
                        <span>{service.uptime}%</span>
                      </div>
                      <Progress value={service.uptime} className="h-2" />
                    </div>

                    {service.status === "degraded" && (
                      <div className="mt-4 flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                          Performance dégradée détectée
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trafic en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Visiteurs actifs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pages/min</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">2.4s</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Temps de chargement</div>
                    </div>
                  </div>

                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <LineChart className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique de trafic en temps réel</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Répartition des ressources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "CPU", value: 45, color: "bg-blue-500" },
                    { name: "Mémoire", value: 68, color: "bg-green-500" },
                    { name: "Disque", value: 34, color: "bg-yellow-500" },
                    { name: "Réseau", value: 23, color: "bg-purple-500" },
                  ].map((resource) => (
                    <div key={resource.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{resource.name}</span>
                        <span>{resource.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`${resource.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${resource.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Événements récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "14:32",
                      event: "Pic de trafic détecté",
                      severity: "info",
                      details: "+45% de visiteurs par rapport à la normale",
                    },
                    {
                      time: "14:28",
                      event: "Service email ralenti",
                      severity: "warning",
                      details: "Temps de réponse: 890ms (normal: 200ms)",
                    },
                    {
                      time: "14:15",
                      event: "Sauvegarde automatique terminée",
                      severity: "success",
                      details: "Base de données sauvegardée avec succès",
                    },
                    {
                      time: "14:10",
                      event: "Nouvelle version déployée",
                      severity: "info",
                      details: "Version 2.1.0 déployée en production",
                    },
                  ].map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          event.severity === "success"
                            ? "bg-green-500"
                            : event.severity === "warning"
                              ? "bg-yellow-500"
                              : event.severity === "error"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-gray-100">{event.event}</span>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "1",
                    title: "Utilisation mémoire élevée",
                    description: "La mémoire RAM atteint 68% d'utilisation",
                    severity: "warning",
                    timestamp: new Date("2024-01-20T14:30:00"),
                    acknowledged: false,
                  },
                  {
                    id: "2",
                    title: "Service email dégradé",
                    description: "Temps de réponse anormalement élevé (890ms)",
                    severity: "warning",
                    timestamp: new Date("2024-01-20T14:28:00"),
                    acknowledged: false,
                  },
                  {
                    id: "3",
                    title: "Pic de trafic",
                    description: "Augmentation de 45% du trafic détectée",
                    severity: "info",
                    timestamp: new Date("2024-01-20T14:32:00"),
                    acknowledged: true,
                  },
                ].map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        alert.severity === "critical"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : alert.severity === "warning"
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alert.severity === "critical"
                            ? "text-red-600"
                            : alert.severity === "warning"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{alert.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{alert.timestamp.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[alert.severity]}>{alert.severity}</Badge>
                          {alert.acknowledged && <Badge variant="outline">Acquittée</Badge>}
                        </div>
                      </div>

                      {!alert.acknowledged && (
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Acquitter
                          </Button>
                          <Button size="sm" variant="outline">
                            Résoudre
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
