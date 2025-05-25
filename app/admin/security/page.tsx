"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Activity,
  Globe,
  Monitor,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Database,
  Network,
  Fingerprint,
} from "lucide-react"

interface SecurityEvent {
  id: string
  type: "login" | "failed_login" | "permission_change" | "data_access" | "api_call" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  user: string
  ip: string
  location: string
  device: string
  timestamp: Date
  details: string
  status: "resolved" | "investigating" | "open"
}

interface SecurityRule {
  id: string
  name: string
  description: string
  category: "authentication" | "authorization" | "data_protection" | "monitoring"
  isEnabled: boolean
  severity: "low" | "medium" | "high" | "critical"
  lastTriggered?: Date
  triggerCount: number
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "failed_login",
    severity: "medium",
    user: "admin@djigaflow.com",
    ip: "192.168.1.100",
    location: "Paris, France",
    device: "Chrome on Windows",
    timestamp: new Date("2024-01-20T14:30:00"),
    details: "5 tentatives de connexion échouées en 2 minutes",
    status: "investigating",
  },
  {
    id: "2",
    type: "suspicious_activity",
    severity: "high",
    user: "user@example.com",
    ip: "45.123.45.67",
    location: "Unknown",
    device: "Unknown",
    timestamp: new Date("2024-01-20T13:15:00"),
    details: "Tentative d'accès à des données sensibles depuis une IP suspecte",
    status: "open",
  },
  {
    id: "3",
    type: "permission_change",
    severity: "medium",
    user: "admin@djigaflow.com",
    ip: "192.168.1.100",
    location: "Paris, France",
    device: "Chrome on Windows",
    timestamp: new Date("2024-01-20T12:00:00"),
    details: "Modification des permissions utilisateur pour user@example.com",
    status: "resolved",
  },
]

const mockSecurityRules: SecurityRule[] = [
  {
    id: "1",
    name: "Authentification à deux facteurs obligatoire",
    description: "Exige l'activation de l'A2F pour tous les comptes administrateurs",
    category: "authentication",
    isEnabled: true,
    severity: "high",
    lastTriggered: new Date("2024-01-19T10:30:00"),
    triggerCount: 3,
  },
  {
    id: "2",
    name: "Détection de tentatives de force brute",
    description: "Bloque automatiquement les IP après 5 tentatives échouées",
    category: "authentication",
    isEnabled: true,
    severity: "critical",
    lastTriggered: new Date("2024-01-20T14:30:00"),
    triggerCount: 12,
  },
  {
    id: "3",
    name: "Chiffrement des données sensibles",
    description: "Chiffre automatiquement toutes les données personnelles",
    category: "data_protection",
    isEnabled: true,
    severity: "critical",
    triggerCount: 0,
  },
  {
    id: "4",
    name: "Surveillance des accès API",
    description: "Monitore et alerte sur les accès API suspects",
    category: "monitoring",
    isEnabled: true,
    severity: "medium",
    lastTriggered: new Date("2024-01-20T11:45:00"),
    triggerCount: 8,
  },
]

const severityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
}

const statusColors = {
  open: "bg-red-100 text-red-800",
  investigating: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
}

const statusIcons = {
  open: XCircle,
  investigating: Clock,
  resolved: CheckCircle,
}

export default function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [rules, setRules] = useState<SecurityRule[]>(mockSecurityRules)
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [showPasswords, setShowPasswords] = useState(false)

  // Statistiques de sécurité
  const totalEvents = events.length
  const criticalEvents = events.filter((e) => e.severity === "critical").length
  const openEvents = events.filter((e) => e.status === "open").length
  const securityScore = Math.round(
    ((rules.filter((r) => r.isEnabled).length / rules.length) * 100 +
      (1 - openEvents / Math.max(totalEvents, 1)) * 100) /
      2,
  )

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule)))
  }

  const updateEventStatus = (eventId: string, status: SecurityEvent["status"]) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status } : event)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sécurité</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Surveillez et protégez votre plateforme contre les menaces
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 heure</SelectItem>
              <SelectItem value="24h">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Score de sécurité */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Score de sécurité</h2>
                <p className="text-gray-600 dark:text-gray-400">Évaluation globale de votre sécurité</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{securityScore}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {securityScore >= 90
                  ? "Excellent"
                  : securityScore >= 70
                    ? "Bon"
                    : securityScore >= 50
                      ? "Moyen"
                      : "Faible"}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={securityScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Événements totaux</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalEvents}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</p>
                <p className="text-2xl font-bold text-orange-600">{openEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Règles actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {rules.filter((r) => r.isEnabled).length}/{rules.length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="rules">Règles</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Événements de sécurité récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => {
                  const StatusIcon = statusIcons[event.status]
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {event.type.replace("_", " ").toUpperCase()}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.details}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={severityColors[event.severity]}>{event.severity}</Badge>
                            <Badge className={statusColors[event.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {event.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-4 w-4" />
                            <span>{event.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{event.ip}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Monitor className="h-4 w-4" />
                            <span>{event.device}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.timestamp.toLocaleString()}</span>
                          </div>
                        </div>

                        {event.status !== "resolved" && (
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateEventStatus(event.id, "investigating")}
                            >
                              Enquêter
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateEventStatus(event.id, "resolved")}>
                              Résoudre
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{rule.name}</h3>
                        <Badge className={severityColors[rule.severity]}>{rule.severity}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rule.description}</p>
                    </div>
                    <Switch checked={rule.isEnabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Catégorie:</span>
                      <span className="font-medium">{rule.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Déclenchements:</span>
                      <span className="font-medium">{rule.triggerCount}</span>
                    </div>
                    {rule.lastTriggered && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Dernier déclenchement:</span>
                        <span className="font-medium">{rule.lastTriggered.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Exiger l'A2F pour tous les administrateurs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Connexion SSO</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permettre la connexion via SSO</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Durée de session (minutes)</Label>
                  <Input type="number" defaultValue="60" />
                </div>

                <div className="space-y-2">
                  <Label>Tentatives de connexion max</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Protection des données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Chiffrement automatique</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chiffrer toutes les données sensibles</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sauvegarde automatique</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sauvegardes quotidiennes chiffrées</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Rétention des logs (jours)</Label>
                  <Input type="number" defaultValue="90" />
                </div>

                <div className="space-y-2">
                  <Label>Clé de chiffrement</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showPasswords ? "text" : "password"}
                      defaultValue="••••••••••••••••"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowPasswords(!showPasswords)}>
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Réseau et accès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Restriction IP</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Limiter l'accès à certaines IP</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>IP autorisées (une par ligne)</Label>
                  <textarea
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    rows={4}
                    placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate limiting</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Limiter le nombre de requêtes par IP</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Biométrie et avancé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Authentification biométrique</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">WebAuthn et empreintes digitales</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Détection d'anomalies IA</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Utiliser l'IA pour détecter les comportements suspects
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Honeypot</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pièges pour détecter les attaquants</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Journal d'audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input placeholder="Rechercher dans les logs..." className="flex-1" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les actions</SelectItem>
                      <SelectItem value="login">Connexions</SelectItem>
                      <SelectItem value="data">Accès aux données</SelectItem>
                      <SelectItem value="config">Modifications config</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                          Utilisateur
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">IP</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {[
                        {
                          timestamp: "2024-01-20 14:30:15",
                          user: "admin@djigaflow.com",
                          action: "Modification des paramètres de sécurité",
                          ip: "192.168.1.100",
                          status: "success",
                        },
                        {
                          timestamp: "2024-01-20 14:25:42",
                          user: "user@example.com",
                          action: "Tentative d'accès aux données clients",
                          ip: "45.123.45.67",
                          status: "blocked",
                        },
                        {
                          timestamp: "2024-01-20 14:20:18",
                          user: "admin@djigaflow.com",
                          action: "Connexion réussie",
                          ip: "192.168.1.100",
                          status: "success",
                        },
                      ].map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{log.timestamp}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{log.user}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{log.action}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{log.ip}</td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                log.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : log.status === "blocked"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {log.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
