"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

/**
 * ERROR BOUNDARY COMPONENT
 *
 * This component handles application errors and provides a user-friendly
 * error interface with recovery options.
 *
 * Features:
 * - Error logging for debugging
 * - User-friendly error message
 * - Recovery actions (retry, go home)
 * - Responsive design
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error("Application Error:", error)

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Oops! Une erreur s'est produite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs font-mono text-muted-foreground">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
