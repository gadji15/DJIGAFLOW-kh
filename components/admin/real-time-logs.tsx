"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { adminLogger } from "@/lib/admin-logger"
import { AlertCircle, Info, AlertTriangle, Bug, Play, Pause, Trash2 } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: Date
  level: "ERROR" | "WARN" | "INFO" | "DEBUG"
  category: string
  action: string
  message: string
  details?: Record<string, any>
}

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
      return null
  }
}

function getLevelBadge(level: string) {
  switch (level) {
    case "ERROR":
      return (
        <Badge variant="destructive" className="text-xs">
          {level}
        </Badge>
      )
    case "WARN":
      return <Badge className="bg-yellow-500 text-xs">{level}</Badge>
    case "INFO":
      return (
        <Badge variant="default" className="text-xs">
          {level}
        </Badge>
      )
    case "DEBUG":
      return (
        <Badge variant="secondary" className="text-xs">
          {level}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {level}
        </Badge>
      )
  }
}

export function RealTimeLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isActive, setIsActive] = useState(true)
  const [maxLogs, setMaxLogs] = useState(50)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      const recentLogs = adminLogger.getLogs({ limit: maxLogs })
      setLogs(recentLogs)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [isActive, maxLogs])

  const handleClear = () => {
    adminLogger.clearLogs()
    setLogs([])
  }

  const handleToggle = () => {
    setIsActive(!isActive)
    if (!isActive) {
      // Immediately refresh when reactivating
      const recentLogs = adminLogger.getLogs({ limit: maxLogs })
      setLogs(recentLogs)
    }
  }

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Logs en temps réel</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              className={isActive ? "bg-green-50 border-green-200" : ""}
            >
              {isActive ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Play
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {isActive ? "Actif" : "En pause"} • {logs.length} logs
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun log récent</p>
              {!isActive && <p className="text-xs mt-1">Cliquez sur Play pour activer la surveillance</p>}
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{getLevelIcon(log.level)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getLevelBadge(log.level)}
                    <Badge variant="outline" className="text-xs">
                      {log.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">{log.action}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{log.message}</p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                        Voir les détails
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
