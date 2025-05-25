"use client"

import { useEffect, useState } from "react"
import { getConnectionStatus } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Wifi, WifiOff } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    error: any
    isDevelopment: boolean
  } | null>(null)

  useEffect(() => {
    const status = getConnectionStatus()
    setStatus(status)
  }, [])

  if (!status) return null

  if (status.isDevelopment) {
    return (
      <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-amber-700">
              Mode Développement
            </Badge>
            Utilisation de données de démonstration. Configurez Supabase pour les données réelles.
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert
      className={`mb-4 ${status.connected ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"}`}
    >
      {status.connected ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-600" />
      )}
      <AlertDescription
        className={status.connected ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}
      >
        <div className="flex items-center gap-2">
          {status.connected ? (
            <>
              <Wifi className="h-4 w-4" />
              <Badge variant="outline" className="text-green-700">
                Connecté
              </Badge>
              Base de données Supabase connectée avec succès
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <Badge variant="outline" className="text-red-700">
                Déconnecté
              </Badge>
              Erreur de connexion à Supabase. Vérifiez vos variables d'environnement.
            </>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
