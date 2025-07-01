"use client"

import type React from "react"

import { useState, useEffect, useCallback, createContext, useContext } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
  isVip: boolean
  permissions: string[]
  profile: any
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthState() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider")
  }
  return context
}

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isManager: false,
    isVip: false,
    permissions: [],
    profile: null,
  })

  const getUserRole = (user: User) => {
    const role = user.user_metadata?.role || "customer"
    return {
      isAdmin: role === "admin",
      isManager: role === "manager" || role === "admin",
      isVip: role === "vip" || role === "admin",
      permissions: getUserPermissions(role),
    }
  }

  const getUserPermissions = (role: string): string[] => {
    const permissionMap = {
      admin: ["all"],
      manager: ["manage_products", "view_orders", "manage_customers"],
      vip: ["view_products", "place_orders", "priority_support"],
      customer: ["view_products", "place_orders"],
    }
    return permissionMap[role as keyof typeof permissionMap] || permissionMap.customer
  }

  const refreshAuth = useCallback(async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error

      if (user) {
        const roleData = getUserRole(user)

        // Fetch user profile
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

        setAuthState({
          user,
          loading: false,
          isAuthenticated: true,
          profile,
          ...roleData,
        })
      } else {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false,
          isManager: false,
          isVip: false,
          permissions: [],
          profile: null,
        })
      }
    } catch (error) {
      console.error("Auth refresh error:", error)
      setAuthState((prev) => ({ ...prev, loading: false }))
    }
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        await refreshAuth()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    },
    [refreshAuth],
  )

  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isManager: false,
        isVip: false,
        permissions: [],
        profile: null,
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }, [])

  const updateProfile = useCallback(
    async (data: any) => {
      try {
        if (!authState.user) throw new Error("No user logged in")

        const { error } = await supabase.from("user_profiles").upsert({
          user_id: authState.user.id,
          ...data,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error

        await refreshAuth()
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    },
    [authState.user, refreshAuth],
  )

  useEffect(() => {
    refreshAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await refreshAuth()
      } else if (event === "SIGNED_OUT") {
        setAuthState({
          user: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false,
          isManager: false,
          isVip: false,
          permissions: [],
          profile: null,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [refreshAuth])

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    refreshAuth,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
