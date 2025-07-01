import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageSquare, HelpCircle } from "lucide-react"
import { EnhancedContactForm } from "@/components/forms/enhanced-contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | DjigaFlow",
  description: "Contactez l'équipe DjigaFlow pour toute question, support technique ou demande de partenariat.",
  keywords: ["contact", "support", "aide", "service client"],
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Téléphone",
      description: "Service client disponible 24/7",
      value: "+33 1 23 45 67 89",
      action: "Appeler maintenant",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      description: "Réponse sous 2h en moyenne",
      value: "contact@djigaflow.com",
      action: "Envoyer un email",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Chat en direct",
      description: "Assistance instantanée",
      value: "Disponible sur le site",
      action: "Démarrer le chat",
    },
  ]

  const faqItems = [
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous pouvez suivre votre commande dans votre espace client ou via le lien reçu par email.",
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais varient de 3 à 15 jours selon la destination et le type de produit.",
    },
    {
      question: "Comment retourner un produit ?",
      answer: "Vous avez 30 jours pour retourner un produit. Contactez-nous pour obtenir une étiquette de retour.",
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      answer: "Oui, nous utilisons le cryptage SSL et respectons les standards PCI DSS pour la sécurité des paiements.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Nous contacter
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Comment pouvons-nous{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  vous aider ?
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Notre équipe de support est disponible 24/7 pour répondre à toutes vos questions et vous accompagner
                dans votre expérience d'achat.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {method.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-3">{method.description}</p>
                    <p className="font-medium mb-4">{method.value}</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <EnhancedContactForm showContactInfo={true} />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
              <p className="text-xl text-muted-foreground">
                Trouvez rapidement des réponses aux questions les plus courantes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-2">{item.question}</h3>
                        <p className="text-muted-foreground text-sm">{item.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <a href="/faq">Voir toutes les FAQ</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
