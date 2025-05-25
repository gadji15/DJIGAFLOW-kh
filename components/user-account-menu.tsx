"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Package, CreditCard, Heart, Settings, LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function UserAccountMenu() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Déconnexion réussie")
      router.push("/")
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
  }

  if (!user) {
    return (
      <Button asChild className="btn-gradient-primary hover:shadow-colored transition-all duration-200">
        <Link href="/connexion">
          <User className="h-4 w-4 mr-2" />
          Connexion
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.user_metadata?.full_name || "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/compte" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Mon compte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/commandes" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Mes commandes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/paiements" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Moyens de paiement
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/liste-souhaits" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Liste de souhaits
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.user_metadata?.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Administration
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
