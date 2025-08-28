import type { Metadata } from "next"
import { EnhancedLoginForm } from "@/components/forms/enhanced-login-form"

export const metadata: Metadata = {
  title: "Connexion | JammShop",
  description:
    "Connectez-vous à votre compte JammShop pour accéder à vos commandes et profiter d'une expérience personnalisée.",
  keywords: ["connexion", "login", "compte", "authentification"],
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <EnhancedLoginForm />
      </div>
    </div>
  )
}
