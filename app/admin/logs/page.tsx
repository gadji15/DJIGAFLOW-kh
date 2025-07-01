"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminLogger } from "@/lib/admin-logger"
import {
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  Info,
  AlertTriangle,
  Bug,
  Clock,
  User,
  Activity,
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: Date
  level: "ERROR" | "WARN" | "INFO" | "DEBUG"
  category: string
  action: string
  user_id?: string
  user_email?: string
  message: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  url?: string
  stack_trace?: string
}

const LOG_LEVELS = [
  { value: "all", label: "Tous les niveaux" },
  { value: "ERROR", label: "Erreurs" },
  { value: "WARN", label: "Avertissements" },
  { value: "INFO", label: "Informations" },
  { value: "DEBUG", label: "Debug" },
]

const LOG_CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "FORM", label: "Formulaires" },
  { value: "UI", label: "Interface utilisateur" },
  { value: "NAVIGATION", label: "Navigation" },
  { value: "CONNECTION", label: "Connexions" },
  { value: "USER_ACTION", label: "Actions utilisateur" },
  { value: "GLOBAL", label: "Erreurs globales" },
]

function getLevelIcon(level: string) {
  switch (level) {
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "WARN":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "INFO":
      return <Info className="h-4 w-4 text-blue-500" />
    case "DEBUG":
      return <Bug className="h-4 w-4 text-gray-500" />
    default:
      return <Activity className="h-4 w-4" />
  }
}

function getLevelBadge(level: string) {
  switch (level) {
    case "ERROR":
      return <Badge variant="destructive">{level}</Badge>
    case "WARN":
      return <Badge className="bg-yellow-500">{level}</Badge>
    case "INFO":
      return <Badge variant="default">{level}</Badge>
    case "DEBUG":
      return <Badge variant="secondary">{level}</Badge>
    default:
      return <Badge variant="outline">{level}</Badge>
  }
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Load logs
  useEffect(() => {
    const loadLogs = () => {
      const allLogs = adminLogger.getLogs({ limit: 500 })
      setLogs(allLogs)
    }

    loadLogs()

    // Auto-refresh every 5 seconds if enabled
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(loadLogs, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Filter logs
  useEffect(() => {
    let filtered = [...logs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((log) => log.level === selectedLevel)
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((log) => log.category === selectedCategory)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedLevel, selectedCategory])

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `admin-logs-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer tous les logs ?")) {
      adminLogger.clearLogs()
      setLogs([])
      setFilteredLogs([])
    }
  }

  const stats = {
    total: logs.length,
    errors: logs.filter((log) => log.level === "ERROR").length,
    warnings: logs.filter((log) => log.level === "WARN").length,
    info: logs.filter((log) => log.level === "INFO").length,
    debug: logs.filter((log) => log.level === "DEBUG").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Logs d'administration</h1>
          <p className="text-gray-600 dark:text-gray-400">Surveillance et débogage des erreurs système</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="destructive" onClick={handleClearLogs}>
            <Trash2 className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Erreurs</p>
                <h3 className="text-2xl font-bold text-red-600">{stats.errors}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avertissements</p>
                <h3 className="text-2xl font-bold text-yellow-600">{stats.warnings}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Informations</p>
                <h3 className="text-2xl font-bold text-blue-600">{stats.info}</h3>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Debug</p>
                <h3 className="text-2xl font-bold text-gray-600">{stats.debug}</h3>
              </div>
              <Bug className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                {LOG_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {LOG_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Logs récents ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedLog?.id === log.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        {getLevelBadge(log.level)}
                        <Badge variant="outline" className="text-xs">
                          {log.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <p className="font-medium text-sm mb-1">{log.action}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{log.message}</p>

                    {log.user_email && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {log.user_email}
                      </div>
                    )}
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun log trouvé avec les filtres actuels</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Détails du log</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{selectedLog.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Niveau:</span>
                        {getLevelBadge(selectedLog.level)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Catégorie:</span>
                        <Badge variant="outline">{selectedLog.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Action:</span>
                        <span>{selectedLog.action}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{selectedLog.message}</p>
                  </div>

                  {selectedLog.user_email && (
                    <div>
                      <h4 className="font-semibold mb-2">Utilisateur</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span>{selectedLog.user_email}</span>
                        </div>
                        {selectedLog.user_id && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono text-xs">{selectedLog.user_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Détails</h4>
                      <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.details, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.stack_trace && (
                    <div>
                      <h4 className="font-semibold mb-2">Stack Trace</h4>
                      <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-x-auto text-red-800 dark:text-red-200">
                        {selectedLog.stack_trace}
                      </pre>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Contexte technique</h4>
                    <div className="space-y-1 text-sm">
                      {selectedLog.url && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">URL:</span>
                          <span className="font-mono text-xs truncate">{selectedLog.url}</span>
                        </div>
                      )}
                      {selectedLog.ip_address && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP:</span>
                          <span>{selectedLog.ip_address}</span>
                        </div>
                      )}
                      {selectedLog.user_agent && (
                        <div>
                          <span className="text-muted-foreground">User Agent:</span>
                          <p className="text-xs mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            {selectedLog.user_agent}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un log pour voir les détails</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
