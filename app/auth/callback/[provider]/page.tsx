import { SocialAuthCallback } from "@/components/auth/social-auth-callback"
import type { Metadata } from "next"

interface CallbackPageProps {
  params: {
    provider: string
  }
}

export async function generateMetadata({ params }: CallbackPageProps): Promise<Metadata> {
  const providerNames = {
    google: "Google",
    facebook: "Facebook",
    apple: "Apple",
  }

  const providerName = providerNames[params.provider as keyof typeof providerNames] || params.provider

  return {
    title: `Connexion ${providerName} | JammShop`,
    description: `Finalisation de votre connexion avec ${providerName}`,
  }
}

export default function CallbackPage({ params }: CallbackPageProps) {
  return <SocialAuthCallback provider={params.provider} />
}
