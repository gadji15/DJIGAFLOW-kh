import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AccountTabs from "./account-tabs"

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Mon compte</h1>

          <AccountTabs />
        </div>
      </main>
      <Footer />
    </div>
  )
}
