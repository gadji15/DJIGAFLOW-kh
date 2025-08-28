import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Globe, Heart, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "À propos de JammShop - Notre Histoire et Mission",
  description:
    "Découvrez l'histoire de JammShop, notre mission et nos valeurs. Une plateforme de dropshipping innovante pour des produits tendance.",
  keywords: "JammShop, à propos, histoire, mission, valeurs, dropshipping, e-commerce",
}

export default function AboutPage() {
  const stats = [
    { label: "Produits disponibles", value: "50,000+", icon: <Globe className="h-6 w-6" /> },
    { label: "Clients satisfaits", value: "25,000+", icon: <Users className="h-6 w-6" /> },
    { label: "Commandes traitées", value: "100,000+", icon: <Award className="h-6 w-6" /> },
    { label: "Pays desservis", value: "15+", icon: <Heart className="h-6 w-6" /> },
  ]

  const values = [
    {
      title: "Innovation",
      description: "Nous utilisons les dernières technologies pour offrir la meilleure expérience d'achat.",
      icon: <Zap className="h-8 w-8" />,
    },
    {
      title: "Qualité",
      description: "Chaque produit est soigneusement sélectionné pour garantir la satisfaction de nos clients.",
      icon: <Award className="h-8 w-8" />,
    },
    {
      title: "Service Client",
      description: "Notre équipe dédiée est disponible 24/7 pour vous accompagner dans vos achats.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Durabilité",
      description: "Nous nous engageons pour un commerce responsable et respectueux de l'environnement.",
      icon: <Globe className="h-8 w-8" />,
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
                À propos de nous
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                L'histoire de{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  JammShop
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Depuis 2020, nous révolutionnons le commerce en ligne avec une plateforme de dropshipping innovante qui
                connecte les consommateurs aux meilleurs produits du monde entier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/catalogue">Découvrir nos produits</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    JammShop est né d'une vision simple : démocratiser l'accès aux produits tendance du monde entier.
                    Fondée en 2020 par une équipe passionnée d'e-commerce, notre plateforme a rapidement évolué pour
                    devenir une référence dans le dropshipping.
                  </p>
                  <p>
                    Nous avons commencé avec une sélection de 100 produits soigneusement choisis. Aujourd'hui, nous
                    proposons plus de 50,000 articles dans des catégories variées, allant de l'électronique à la mode,
                    en passant par la maison et le jardin.
                  </p>
                  <p>
                    Notre succès repose sur trois piliers : la qualité de nos produits, l'excellence de notre service
                    client, et l'innovation technologique constante de notre plateforme.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Histoire de JammShop"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Ces valeurs guident chacune de nos décisions et façonnent l'expérience que nous offrons à nos clients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Une équipe passionnée et expérimentée, dédiée à votre satisfaction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Marie Dubois", role: "CEO & Fondatrice", image: "/placeholder.svg?height=300&width=300" },
                { name: "Jean Martin", role: "CTO", image: "/placeholder.svg?height=300&width=300" },
                {
                  name: "Sophie Laurent",
                  role: "Directrice Marketing",
                  image: "/placeholder.svg?height=300&width=300",
                },
              ].map((member, index) => (
                <Card key={index} className="text-center overflow-hidden">
                  <div className="relative h-64">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Rejoignez l'aventure JammShop</h2>
            <p className="text-xl mb-8 opacity-90">
              Découvrez des milliers de produits tendance et profitez d'une expérience d'achat exceptionnelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/inscription">Créer un compte</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/catalogue">Explorer le catalogue</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
