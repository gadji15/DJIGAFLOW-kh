"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Settings, X } from "lucide-react"
import { getConnectionStatus } from "@/lib/supabase"

export function ConnectionStatus() {
  const [status, setStatus] = useState(getConnectionStatus())
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setStatus(getConnectionStatus())
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className={`${status.isDemoMode ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            {status.isDemoMode ? (
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant={status.isDemoMode ? "secondary" : "default"}>
                  {status.isDemoMode ? "Mode Démo" : "Connecté"}
                </Badge>
              </div>
              <AlertDescription className="text-sm">{status.message}</AlertDescription>
              {status.isDemoMode && (
                <div className="mt-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Configurer Supabase
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
