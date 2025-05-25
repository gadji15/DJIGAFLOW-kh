import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import RegisterForm from "./register-form"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
            <p className="text-muted-foreground">Inscrivez-vous pour profiter de tous les avantages</p>
          </div>

          <RegisterForm />

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/connexion" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
