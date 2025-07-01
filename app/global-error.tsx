"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

/**
 * GLOBAL ERROR BOUNDARY
 *
 * This component catches errors that occur in the root layout
 * and provides a fallback UI for critical application failures.
 *
 * Note: This component must be a client component and will replace
 * the entire page when a global error occurs.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log critical error
    console.error("Global Application Error:", error)

    // Send to error monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { level: 'fatal' })
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Erreur critique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600">
                Une erreur critique s'est produite. Veuillez recharger la page.
              </p>

              <Button onClick={reset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharger l'application
              </Button>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
