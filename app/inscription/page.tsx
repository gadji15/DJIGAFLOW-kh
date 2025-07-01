import type { Metadata } from "next"
import { EnhancedRegisterForm } from "@/components/forms/enhanced-register-form"

export const metadata: Metadata = {
  title: "Inscription | DjigaFlow",
  description: "Créez votre compte DjigaFlow et rejoignez notre communauté pour découvrir nos produits exclusifs.",
  keywords: ["inscription", "register", "compte", "créer compte"],
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <EnhancedRegisterForm />
      </div>
    </div>
  )
}
