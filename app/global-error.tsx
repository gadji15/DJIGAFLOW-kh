"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Erreur critique</h1>
            <p className="text-muted-foreground mb-6">
              Une erreur critique s'est produite. Veuillez recharger la page.
            </p>

            <Button onClick={reset} className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              Recharger la page
            </Button>

            {error.digest && <div className="mt-4 text-xs text-muted-foreground">ID d'erreur: {error.digest}</div>}
          </div>
        </div>
      </body>
    </html>
  )
}
