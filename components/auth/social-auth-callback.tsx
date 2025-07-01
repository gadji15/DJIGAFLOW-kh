"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handleSocialAuthCallback } from "@/lib/auth/social-auth"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

interface SocialAuthCallbackProps {
  provider: string
}

export function SocialAuthCallback({ provider }: SocialAuthCallbackProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`Erreur d'authentification: ${error}`)
        }

        if (!code) {
          throw new Error("Code d'autorisation manquant")
        }

        const result = await handleSocialAuthCallback(provider, code, state || "")

        if (result.success && result.user) {
          // Simulate successful authentication
          await login(result.user.email, "social-auth-token")

          setStatus("success")

          toast({
            title: "Connexion réussie !",
            description: `Bienvenue ${result.user.name}`,
            duration: 3000,
          })

          // Redirect after success
          setTimeout(() => {
            router.push("/compte")
          }, 2000)
        } else {
          throw new Error(result.error || "Erreur lors de l'authentification")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue"
        setError(errorMessage)
        setStatus("error")

        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        })
      }
    }

    handleCallback()
  }, [provider, searchParams, login, router])

  const getProviderName = (provider: string) => {
    const names = {
      google: "Google",
      facebook: "Facebook",
      apple: "Apple",
    }
    return names[provider as keyof typeof names] || provider
  }

  const getProviderIcon = (provider: string) => {
    const icons = {
      google: "🔍",
      facebook: "📘",
      apple: "🍎",
    }
    return icons[provider as keyof typeof icons] || "🔐"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-4xl">{getProviderIcon(provider)}</div>
          <CardTitle>
            {status === "loading" && "Connexion en cours..."}
            {status === "success" && "Connexion réussie !"}
            {status === "error" && "Erreur de connexion"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">
                Finalisation de votre connexion avec {getProviderName(provider)}...
              </p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <CheckCircle2 className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-muted-foreground">
                Vous êtes maintenant connecté avec {getProviderName(provider)}. Redirection en cours...
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
              <p className="text-muted-foreground">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/connexion")} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Réessayer
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
