"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthState } from "./use-auth-state"
import { useToast } from "./use-toast"

interface AuthButtonsState {
  showLogin: boolean
  showLogout: boolean
  showRegister: boolean
  showProfile: boolean
  isTransitioning: boolean
  buttonVariant: "default" | "ghost" | "outline"
}

export function useAuthButtons() {
  const { isAuthenticated, loading, user } = useAuthState()
  const { toast } = useToast()

  const [state, setState] = useState<AuthButtonsState>({
    showLogin: false,
    showLogout: false,
    showRegister: false,
    showProfile: false,
    isTransitioning: false,
    buttonVariant: "default",
  })

  const updateButtonsState = useCallback(() => {
    if (loading) return

    setState((prev) => ({
      ...prev,
      isTransitioning: true,
    }))

    // Simulate transition delay for smooth animations
    setTimeout(() => {
      setState({
        showLogin: !isAuthenticated,
        showLogout: isAuthenticated,
        showRegister: !isAuthenticated,
        showProfile: isAuthenticated,
        isTransitioning: false,
        buttonVariant: isAuthenticated ? "ghost" : "default",
      })
    }, 150)
  }, [isAuthenticated, loading])

  useEffect(() => {
    updateButtonsState()
  }, [updateButtonsState])

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isTransitioning: true }))

      try {
        // Login logic would go here
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${user?.email || email} !`,
          type: "success",
        })
      } catch (error) {
        toast({
          title: "Erreur de connexion",
          description: "Vérifiez vos identifiants et réessayez.",
          type: "error",
        })
      } finally {
        setState((prev) => ({ ...prev, isTransitioning: false }))
      }
    },
    [toast, user],
  )

  const handleLogout = useCallback(async () => {
    setState((prev) => ({ ...prev, isTransitioning: true }))

    try {
      // Logout logic would go here
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion.",
        type: "error",
      })
    } finally {
      setState((prev) => ({ ...prev, isTransitioning: false }))
    }
  }, [toast])

  const handleRegister = useCallback(
    async (email: string, password: string, userData?: any) => {
      setState((prev) => ({ ...prev, isTransitioning: true }))

      try {
        // Registration logic would go here
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
          type: "success",
        })
      } catch (error) {
        toast({
          title: "Erreur d'inscription",
          description: "Une erreur est survenue lors de l'inscription.",
          type: "error",
        })
      } finally {
        setState((prev) => ({ ...prev, isTransitioning: false }))
      }
    },
    [toast],
  )

  const getButtonAnimationClass = useCallback(
    (buttonType: "login" | "logout" | "register" | "profile") => {
      const isVisible =
        state[`show${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}` as keyof AuthButtonsState]

      return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.3s ease-in-out",
        pointerEvents: isVisible ? "auto" : ("none" as const),
      }
    },
    [state],
  )

  return {
    ...state,
    handleLogin,
    handleLogout,
    handleRegister,
    getButtonAnimationClass,
    isLoading: loading,
  }
}
