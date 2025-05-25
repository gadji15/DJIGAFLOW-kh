import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, HelpCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "FAQ - Questions Fréquentes | DjigaFlow",
  description:
    "Trouvez des réponses à toutes vos questions sur DjigaFlow : commandes, livraisons, retours, paiements et plus.",
  keywords: "FAQ, questions fréquentes, aide, support, DjigaFlow, commandes, livraison",
}

export default function FAQPage() {
  const categories = [
    {
      title: "Commandes",
      icon: "🛒",
      questions: [
        {
          question: "Comment passer une commande ?",
          answer:
            "Pour passer une commande, ajoutez vos produits au panier, puis cliquez sur 'Passer commande'. Suivez les étapes de paiement et de livraison.",
        },
        {
          question: "Puis-je modifier ma commande après validation ?",
          answer:
            "Vous pouvez modifier votre commande dans les 2 heures suivant la validation, en nous contactant directement.",
        },
        {
          question: "Comment annuler ma commande ?",
          answer:
            "Vous pouvez annuler votre commande gratuitement avant expédition via votre espace client ou en nous contactant.",
        },
      ],
    },
    {
      title: "Livraison",
      icon: "🚚",
      questions: [
        {
          question: "Quels sont les délais de livraison ?",
          answer:
            "Les délais varient de 3 à 15 jours selon la destination et le type de produit. Vous recevrez un suivi par email.",
        },
        {
          question: "Livrez-vous partout en France ?",
          answer:
            "Oui, nous livrons dans toute la France métropolitaine et dans les DOM-TOM. Des frais supplémentaires peuvent s'appliquer.",
        },
        {
          question: "Comment suivre ma commande ?",
          answer:
            "Vous recevrez un numéro de suivi par email dès l'expédition. Vous pouvez aussi suivre votre commande dans votre espace client.",
        },
      ],
    },
    {
      title: "Paiements",
      icon: "💳",
      questions: [
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal, Apple Pay, Google Pay et Klarna.",
        },
        {
          question: "Les paiements sont-ils sécurisés ?",
          answer:
            "Oui, tous nos paiements sont sécurisés avec le cryptage SSL et nous respectons les standards PCI DSS.",
        },
        {
          question: "Puis-je payer en plusieurs fois ?",
          answer:
            "Oui, nous proposons le paiement en 3 ou 4 fois sans frais avec Klarna pour les commandes de plus de 50€.",
        },
      ],
    },
    {
      title: "Retours & Remboursements",
      icon: "↩️",
      questions: [
        {
          question: "Comment retourner un produit ?",
          answer:
            "Vous avez 30 jours pour retourner un produit. Contactez-nous pour obtenir une étiquette de retour gratuite.",
        },
        {
          question: "Dans quels cas puis-je être remboursé ?",
          answer:
            "Vous pouvez être remboursé si le produit est défectueux, non conforme ou si vous changez d'avis dans les 30 jours.",
        },
        {
          question: "Combien de temps prend le remboursement ?",
          answer: "Le remboursement est traité sous 5-7 jours ouvrés après réception du produit retourné.",
        },
      ],
    },
    {
      title: "Compte Client",
      icon: "👤",
      questions: [
        {
          question: "Comment créer un compte ?",
          answer: "Cliquez sur 'Inscription' en haut de la page, remplissez vos informations et validez votre email.",
        },
        {
          question: "J'ai oublié mon mot de passe",
          answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion et suivez les instructions par email.",
        },
        {
          question: "Comment modifier mes informations personnelles ?",
          answer:
            "Connectez-vous à votre espace client et accédez à la section 'Mon profil' pour modifier vos informations.",
        },
      ],
    },
    {
      title: "Produits",
      icon: "📦",
      questions: [
        {
          question: "Les produits sont-ils garantis ?",
          answer:
            "Tous nos produits bénéficient de la garantie légale de conformité de 2 ans et de la garantie constructeur.",
        },
        {
          question: "Comment connaître la disponibilité d'un produit ?",
          answer:
            "La disponibilité est indiquée sur chaque fiche produit. Les produits en rupture sont marqués comme 'Indisponible'.",
        },
        {
          question: "Proposez-vous des produits reconditionnés ?",
          answer:
            "Nous proposons une sélection de produits reconditionnés certifiés, clairement identifiés sur le site.",
        },
      ],
    },
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
                Centre d'aide
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Questions{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fréquentes
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Trouvez rapidement des réponses à toutes vos questions sur DjigaFlow.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Rechercher dans la FAQ..." className="pl-12 pr-4 py-3 text-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <Card key={questionIndex} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <details className="group">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                              <div className="flex items-start gap-3">
                                <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                <h3 className="font-semibold text-left">{item.question}</h3>
                              </div>
                              <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6 pt-0">
                              <div className="ml-8 text-muted-foreground">{item.answer}</div>
                            </div>
                          </details>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe de support est disponible 24/7 pour vous aider avec toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Nous contacter</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/chat">Chat en direct</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
