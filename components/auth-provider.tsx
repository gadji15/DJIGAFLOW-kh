"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
...
  const supabase = createBrowserClient()

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      // Créer l'entrée utilisateur dans la table users
      if (!error) {
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
          await supabase.from("users").insert({
            id: userData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            role: "customer",
          })
        }
      }

      return { error }
    } catch (error) {
      console.error("Error signing up:", error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
