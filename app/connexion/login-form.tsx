"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Utiliser le vrai signIn du contexte d'auth
      if (!email.trim() || !password.trim()) {
        toast.error("Veuillez remplir tous les champs.")
        setIsLoading(false)
        return
      }

      const { error } = await signIn(email, password)

      if (!error) {
        toast.success("Connexion réussie !")
        setTimeout(() => {
          router.push("/")
        }, 1200)
      } else {
        toast.error("Email ou mot de passe incorrect.")
      }
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </Button>
    </form>
  )
}
