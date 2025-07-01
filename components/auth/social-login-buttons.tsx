"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { socialProviders, initiateSocialLogin, type SocialProvider } from "@/lib/auth/social-auth"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

interface SocialLoginButtonsProps {
  variant?: "default" | "compact" | "icons-only"
  orientation?: "horizontal" | "vertical"
  showDivider?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function SocialLoginButtons({
  variant = "default",
  orientation = "vertical",
  showDivider = true,
  onSuccess,
  onError,
}: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider.id)

      const result = await initiateSocialLogin(provider.id)

      if (result.success && result.user) {
        // Simulate successful authentication
        await login(result.user.email, "social-auth-token")

        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${result.user.name}`,
          duration: 3000,
        })

        onSuccess?.()
      } else {
        const errorMessage = result.error || "Erreur lors de la connexion"
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        })
        onError?.(errorMessage)
      }
    } catch (error) {
      const errorMessage = "Une erreur inattendue s'est produite"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
      onError?.(errorMessage)
    } finally {
      setLoadingProvider(null)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  const renderButton = (provider: SocialProvider) => {
    const isLoading = loadingProvider === provider.id
    const isDisabled = loadingProvider !== null

    return (
      <motion.div key={provider.id} variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          size={variant === "compact" ? "sm" : "default"}
          className={`
            relative overflow-hidden transition-all duration-200
            ${provider.color} ${provider.textColor}
            ${orientation === "horizontal" ? "flex-1" : "w-full"}
            ${variant === "icons-only" ? "aspect-square p-0" : ""}
            ${isDisabled && !isLoading ? "opacity-50" : ""}
          `}
          onClick={() => handleSocialLogin(provider)}
          disabled={isDisabled}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                {variant !== "icons-only" && <span className="ml-2">Connexion...</span>}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center"
              >
                <span className="text-lg" role="img" aria-label={provider.name}>
                  {provider.icon}
                </span>
                {variant !== "icons-only" && (
                  <span className="ml-2">
                    {variant === "compact" ? provider.name : `Continuer avec ${provider.name}`}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {showDivider && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou continuez avec</span>
          </div>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`
          ${orientation === "horizontal" ? "flex gap-2" : "space-y-2"}
        `}
      >
        {socialProviders.map(renderButton)}
      </motion.div>

      {/* Trust indicators */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>Connexion sécurisée et chiffrée</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Nous ne stockons jamais vos mots de passe</p>
      </div>
    </div>
  )
}
