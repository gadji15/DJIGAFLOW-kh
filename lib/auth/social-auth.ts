"use client"

import { toast } from "@/hooks/use-toast"

export interface SocialProvider {
  id: string
  name: string
  icon: string
  color: string
  textColor: string
}

export const socialProviders: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: "🔍",
    color: "bg-white border-gray-300 hover:bg-gray-50",
    textColor: "text-gray-700",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "📘",
    color: "bg-[#1877F2] hover:bg-[#166FE5]",
    textColor: "text-white",
  },
  {
    id: "apple",
    name: "Apple",
    icon: "🍎",
    color: "bg-black hover:bg-gray-800",
    textColor: "text-white",
  },
]

export interface SocialAuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
    avatar?: string
    provider: string
  }
  error?: string
}

// Simulate OAuth flow - in production, this would integrate with actual OAuth providers
export const initiateSocialLogin = async (provider: string): Promise<SocialAuthResponse> => {
  try {
    // Show loading state
    toast({
      title: "Connexion en cours...",
      description: `Redirection vers ${provider}...`,
    })

    // Simulate OAuth redirect and callback
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate different outcomes
    const outcomes = [
      { success: true, probability: 0.8 },
      { success: false, error: "cancelled", probability: 0.1 },
      { success: false, error: "network", probability: 0.1 },
    ]

    const random = Math.random()
    let cumulativeProbability = 0
    let outcome = outcomes[0]

    for (const o of outcomes) {
      cumulativeProbability += o.probability
      if (random <= cumulativeProbability) {
        outcome = o
        break
      }
    }

    if (!outcome.success) {
      const errorMessages = {
        cancelled: "Connexion annulée par l'utilisateur",
        network: "Erreur de connexion. Veuillez réessayer.",
      }

      return {
        success: false,
        error: errorMessages[outcome.error as keyof typeof errorMessages] || "Erreur inconnue",
      }
    }

    // Simulate successful login
    const mockUser = {
      id: `${provider}_${Date.now()}`,
      email: `user@${provider}.com`,
      name: `Utilisateur ${provider}`,
      avatar: `/placeholder.svg?height=40&width=40`,
      provider,
    }

    // Store in localStorage (in production, this would be handled by your auth system)
    localStorage.setItem("user", JSON.stringify(mockUser))
    localStorage.setItem("authProvider", provider)

    return {
      success: true,
      user: mockUser,
    }
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la connexion sociale",
    }
  }
}

export const getSocialAuthUrl = (provider: string, redirectUrl?: string): string => {
  // In production, these would be real OAuth URLs
  const baseUrls = {
    google: "https://accounts.google.com/oauth/authorize",
    facebook: "https://www.facebook.com/v18.0/dialog/oauth",
    apple: "https://appleid.apple.com/auth/authorize",
  }

  const clientIds = {
    google: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-google-client-id",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "demo-facebook-app-id",
    apple: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "demo-apple-client-id",
  }

  const scopes = {
    google: "openid email profile",
    facebook: "email public_profile",
    apple: "email name",
  }

  const params = new URLSearchParams({
    client_id: clientIds[provider as keyof typeof clientIds],
    redirect_uri: redirectUrl || `${window.location.origin}/auth/callback/${provider}`,
    scope: scopes[provider as keyof typeof scopes],
    response_type: "code",
    state: generateState(),
  })

  return `${baseUrls[provider as keyof typeof baseUrls]}?${params.toString()}`
}

const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const handleSocialAuthCallback = async (
  provider: string,
  code: string,
  state: string,
): Promise<SocialAuthResponse> => {
  try {
    // In production, this would exchange the code for tokens
    // and fetch user information from the provider's API

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = {
      id: `${provider}_${Date.now()}`,
      email: `user@${provider}.com`,
      name: `Utilisateur ${provider}`,
      avatar: `/placeholder.svg?height=40&width=40`,
      provider,
    }

    return {
      success: true,
      user: mockUser,
    }
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la validation de l'authentification",
    }
  }
}
