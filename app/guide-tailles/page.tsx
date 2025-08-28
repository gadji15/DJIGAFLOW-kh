
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ruler, User, Shirt, Footprints } from "lucide-react"

export const metadata = {
  title: "Guide des Tailles - Trouvez la Taille Parfaite | JammShop",
  description:
    "Guide complet des tailles pour vêtements, chaussures et accessoires. Tableaux de correspondance et conseils de mesure.",
  keywords: "guide tailles, mesures, vêtements, chaussures, correspondance, JammShop",
}

export default function SizeGuidePage() {
  const clothingSizes = {
    women: [
      { size: "XS", chest: "82-86", waist: "64-68", hips: "88-92", fr: "34", us: "2", uk: "6" },
      { size: "S", chest: "86-90", waist: "68-72", hips: "92-96", fr: "36", us: "4", uk: "8" },
      { size: "M", chest: "90-94", waist: "72-76", hips: "96-100", fr: "38", us: "6", uk: "10" },
      { size: "L", chest: "94-98", waist: "76-80", hips: "100-104", fr: "40", us: "8", uk: "12" },
      { size: "XL", chest: "98-102", waist: "80-84", hips: "104-108", fr: "42", us: "10", uk: "14" },
      { size: "XXL", chest: "102-106", waist: "84-88", hips: "108-112", fr: "44", us: "12", uk: "16" },
    ],
    men: [
      { size: "XS", chest: "86-90", waist: "76-80", fr: "44", us: "34", uk: "34" },
      { size: "S", chest: "90-94", waist: "80-84", fr: "46", us: "36", uk: "36" },
      { size: "M", chest: "94-98", waist: "84-88", fr: "48", us: "38", uk: "38" },
      { size: "L", chest: "98-102", waist: "88-92", fr: "50", us: "40", uk: "40" },
      { size: "XL", chest: "102-106", waist: "92-96", fr: "52", us: "42", uk: "42" },
      { size: "XXL", chest: "106-110", waist: "96-100", fr: "54", us: "44", uk: "44" },
    ],
  }

  const shoeSizes = {
    women: [
      { eu: "35", fr: "35", us: "5", uk: "2.5", cm: "22.5" },
      { eu: "36", fr: "36", us: "6", uk: "3.5", cm: "23" },
      { eu: "37", fr: "37", us: "6.5", uk: "4", cm: "23.5" },
      { eu: "38", fr: "38", us: "7.5", uk: "5", cm: "24" },
      { eu: "39", fr: "39", us: "8", uk: "5.5", cm: "24.5" },
      { eu: "40", fr: "40", us: "9", uk: "6.5", cm: "25" },
      { eu: "41", fr: "41", us: "9.5", uk: "7", cm: "25.5" },
      { eu: "42", fr: "42", us: "10.5", uk: "8", cm: "26" },
    ],
    men: [
      { eu: "39", fr: "39", us: "6.5", uk: "6", cm: "24.5" },
      { eu: "40", fr: "40", us: "7", uk: "6.5", cm: "25" },
      { eu: "41", fr: "41", us: "8", uk: "7.5", cm: "25.5" },
      { eu: "42", fr: "42", us: "8.5", uk: "8", cm: "26" },
      { eu: "43", fr: "43", us: "9.5", uk: "9", cm: "26.5" },
      { eu: "44", fr: "44", us: "10", uk: "9.5", cm: "27" },
      { eu: "45", fr: "45", us: "11", uk: "10.5", cm: "27.5" },
      { eu: "46", fr: "46", us: "12", uk: "11.5", cm: "28" },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                Guide des tailles
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Trouvez votre{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Taille Parfaite
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Utilisez notre guide complet pour choisir la bonne taille et éviter les retours.
              </p>
            </div>
          </div>
        </section>

        {/* How to Measure */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment bien se mesurer</h2>
              <p className="text-xl text-muted-foreground">Suivez ces étapes pour obtenir des mesures précises</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <Ruler className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle>Utilisez un mètre ruban</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Utilisez un mètre ruban souple et mesurez directement sur la peau ou sur des sous-vêtements ajustés.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle>Tenez-vous droit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gardez une posture naturelle et droite. Respirez normalement pendant la mesure.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                      <Shirt className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle>Mesurez correctement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Le mètre doit être bien ajusté sans serrer. Prenez plusieurs mesures pour vérifier.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Size Charts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tableaux des tailles</h2>
              <p className="text-xl text-muted-foreground">Correspondances internationales pour tous nos produits</p>
            </div>

            <Tabs defaultValue="clothing" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="clothing" className="flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Vêtements
                </TabsTrigger>
                <TabsTrigger value="shoes" className="flex items-center gap-2">
                  <Footprints className="h-4 w-4" />
                  Chaussures
                </TabsTrigger>
              </TabsList>

              <TabsContent value="clothing" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Women's Clothing */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vêtements Femme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Taille</th>
                              <th className="text-left p-2">Poitrine (cm)</th>
                              <th className="text-left p-2">Taille (cm)</th>
                              <th className="text-left p-2">Hanches (cm)</th>
                              <th className="text-left p-2">FR</th>
                              <th className="text-left p-2">US</th>
                              <th className="text-left p-2">UK</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clothingSizes.women.map((size, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-medium">{size.size}</td>
                                <td className="p-2">{size.chest}</td>
                                <td className="p-2">{size.waist}</td>
                                <td className="p-2">{size.hips}</td>
                                <td className="p-2">{size.fr}</td>
                                <td className="p-2">{size.us}</td>
                                <td className="p-2">{size.uk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Men's Clothing */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vêtements Homme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Taille</th>
                              <th className="text-left p-2">Poitrine (cm)</th>
                              <th className="text-left p-2">Taille (cm)</th>
                              <th className="text-left p-2">FR</th>
                              <th className="text-left p-2">US</th>
                              <th className="text-left p-2">UK</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clothingSizes.men.map((size, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-medium">{size.size}</td>
                                <td className="p-2">{size.chest}</td>
                                <td className="p-2">{size.waist}</td>
                                <td className="p-2">{size.fr}</td>
                                <td className="p-2">{size.us}</td>
                                <td className="p-2">{size.uk}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shoes" className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Women's Shoes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chaussures Femme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">EU</th>
                              <th className="text-left p-2">FR</th>
                              <th className="text-left p-2">US</th>
                              <th className="text-left p-2">UK</th>
                              <th className="text-left p-2">CM</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shoeSizes.women.map((size, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-medium">{size.eu}</td>
                                <td className="p-2">{size.fr}</td>
                                <td className="p-2">{size.us}</td>
                                <td className="p-2">{size.uk}</td>
                                <td className="p-2">{size.cm}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Men's Shoes */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chaussures Homme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">EU</th>
                              <th className="text-left p-2">FR</th>
                              <th className="text-left p-2">US</th>
                              <th className="text-left p-2">UK</th>
                              <th className="text-left p-2">CM</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shoeSizes.men.map((size, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 font-medium">{size.eu}</td>
                                <td className="p-2">{size.fr}</td>
                                <td className="p-2">{size.us}</td>
                                <td className="p-2">{size.uk}</td>
                                <td className="p-2">{size.cm}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Conseils pratiques</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Entre deux tailles ?</h3>
                  <p className="text-muted-foreground text-sm">
                    Choisissez la taille supérieure pour plus de confort, surtout pour les vêtements ajustés.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Matières extensibles</h3>
                  <p className="text-muted-foreground text-sm">
                    Pour les tissus stretch, vous pouvez prendre votre taille habituelle ou une taille en dessous.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Chaussures en cuir</h3>
                  <p className="text-muted-foreground text-sm">
                    Le cuir se détend avec le temps. Choisissez une taille légèrement ajustée au début.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Mesures le soir</h3>
                  <p className="text-muted-foreground text-sm">
                    Mesurez-vous en fin de journée quand votre corps est légèrement gonflé.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Vérifiez les avis</h3>
                  <p className="text-muted-foreground text-sm">
                    Lisez les commentaires clients pour connaître la coupe réelle du produit.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Contactez-nous</h3>
                  <p className="text-muted-foreground text-sm">
                    En cas de doute, notre équipe est là pour vous conseiller sur la taille.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Besoin d'aide pour choisir ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Notre équipe est disponible pour vous conseiller sur la taille parfaite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Nous contacter
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Chat en direct
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
