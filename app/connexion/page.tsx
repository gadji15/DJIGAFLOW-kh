import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Connexion</h1>
            <p className="text-muted-foreground">Connectez-vous pour accéder à votre compte</p>
          </div>

          <LoginForm />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
              <Link href="/inscription" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
