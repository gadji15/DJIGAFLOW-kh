"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { adminLogger } from "@/lib/admin-logger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    adminLogger.error(
      "REACT",
      "component_error",
      `React component error: ${error.message}`,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: "AdminErrorBoundary",
      },
      error,
    )

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleGoHome = () => {
    window.location.href = "/admin"
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Erreur de l'interface d'administration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-600">
                <p>Une erreur inattendue s'est produite dans l'interface d'administration.</p>
                <p className="text-sm mt-2">L'erreur a été automatiquement enregistrée pour analyse.</p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Détails de l'erreur (développement)</h4>
                  <pre className="text-xs text-red-700 overflow-x-auto">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-red-800 font-medium">Component Stack</summary>
                      <pre className="text-xs text-red-700 mt-2 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={this.handleReset} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                <Button onClick={this.handleGoHome}>
                  <Home className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">ID d'erreur: {Date.now().toString(36)}</div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
