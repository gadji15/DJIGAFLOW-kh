import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Clock, MapPin, Package, Shield, RotateCcw } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Livraison & Retours - Informations Complètes | DjigaFlow",
  description:
    "Découvrez nos options de livraison, délais, tarifs et politique de retours. Livraison gratuite dès 50€.",
  keywords: "livraison, retours, délais, tarifs, DjigaFlow, expédition",
}

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: "Livraison Standard",
      icon: <Truck className="h-6 w-6" />,
      delay: "5-7 jours ouvrés",
      price: "4,99€",
      description: "Livraison à domicile ou en point relais",
      free: "Gratuite dès 50€",
    },
    {
      name: "Livraison Express",
      icon: <Clock className="h-6 w-6" />,
      delay: "2-3 jours ouvrés",
      price: "9,99€",
      description: "Livraison rapide à domicile",
      free: "Gratuite dès 100€",
    },
    {
      name: "Livraison Premium",
      icon: <Package className="h-6 w-6" />,
      delay: "24-48h",
      price: "14,99€",
      description: "Livraison ultra-rapide avec suivi",
      free: "Gratuite dès 150€",
    },
  ]

  const countries = [
    { name: "France métropolitaine", delay: "3-7 jours", price: "Dès 4,99€" },
    { name: "Corse", delay: "5-10 jours", price: "Dès 9,99€" },
    { name: "DOM-TOM", delay: "7-15 jours", price: "Dès 19,99€" },
    { name: "Union Européenne", delay: "5-12 jours", price: "Dès 12,99€" },
    { name: "Suisse", delay: "7-14 jours", price: "Dès 15,99€" },
    { name: "Reste du monde", delay: "10-21 jours", price: "Dès 24,99€" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Livraison & Retours
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Livraison{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rapide & Sûre
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Découvrez nos options de livraison flexibles et notre politique de retours généreuse pour une expérience
                d'achat sans souci.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Options de livraison</h2>
              <p className="text-xl text-muted-foreground">Choisissez l'option qui vous convient le mieux</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {shippingOptions.map((option, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {option.icon}
                      </div>
                    </div>
                    <CardTitle>{option.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-blue-600">{option.delay}</div>
                      <div className="text-lg font-semibold">{option.price}</div>
                      <p className="text-muted-foreground">{option.description}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {option.free}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Countries & Zones */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Zones de livraison</h2>
              <p className="text-xl text-muted-foreground">Nous livrons dans le monde entier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map((country, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">{country.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Délai :</span>
                        <span className="font-medium">{country.delay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tarif :</span>
                        <span className="font-medium">{country.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Politique de retours</h2>
              <p className="text-xl text-muted-foreground">30 jours pour changer d'avis, retours gratuits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">30 jours pour retourner</h3>
                      <p className="text-muted-foreground">
                        Vous avez 30 jours à partir de la réception pour retourner vos articles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Retours gratuits</h3>
                      <p className="text-muted-foreground">
                        Nous prenons en charge les frais de retour pour votre satisfaction.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Remboursement rapide</h3>
                      <p className="text-muted-foreground">Remboursement sous 5-7 jours après réception du retour.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">Demander un retour</Link>
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Comment retourner un article ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <strong>Contactez-nous</strong>
                        <p className="text-muted-foreground text-sm">
                          Envoyez-nous un message avec votre numéro de commande
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <strong>Recevez l'étiquette</strong>
                        <p className="text-muted-foreground text-sm">
                          Nous vous envoyons une étiquette de retour gratuite
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <strong>Expédiez le colis</strong>
                        <p className="text-muted-foreground text-sm">Emballez l'article et collez l'étiquette</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-white text-sm flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <strong>Remboursement</strong>
                        <p className="text-muted-foreground text-sm">Vous êtes remboursé dès réception</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Comment suivre ma commande ?",
                  answer:
                    "Vous recevrez un email avec un lien de suivi dès l'expédition. Vous pouvez aussi suivre votre commande dans votre espace client.",
                },
                {
                  question: "Que faire si mon colis est endommagé ?",
                  answer:
                    "Contactez-nous immédiatement avec des photos. Nous organiserons un échange ou un remboursement complet.",
                },
                {
                  question: "Puis-je modifier l'adresse de livraison ?",
                  answer:
                    "Oui, tant que la commande n'est pas expédiée. Contactez-nous rapidement pour modifier l'adresse.",
                },
                {
                  question: "Livrez-vous le weekend ?",
                  answer:
                    "Nos partenaires livrent du lundi au samedi. Certaines options premium incluent la livraison le dimanche.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/faq">Voir toutes les FAQ</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
