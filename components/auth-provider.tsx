"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
            avatar: session.user.user_metadata?.avatar_url,
            provider: session.user.app_metadata?.provider,
          }
          setUser(authUser)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "",
          avatar: session.user.user_metadata?.avatar_url,
          provider: session.user.app_metadata?.provider,
        }
        setUser(authUser)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "",
          avatar: data.user.user_metadata?.avatar_url,
          provider: data.user.app_metadata?.provider,
        }
        setUser(authUser)
      }
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || "",
          name: name,
          avatar: data.user.user_metadata?.avatar_url,
        }
        setUser(authUser)
      }
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la déconnexion")
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) throw new Error("Utilisateur non connecté")

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.name,
          avatar_url: data.avatar,
        },
      })

      if (error) throw error

      setUser((prev) => (prev ? { ...prev, ...data } : null))
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
