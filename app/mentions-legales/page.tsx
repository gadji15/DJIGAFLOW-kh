import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Mentions Légales - JammShop",
  description: "Mentions légales, informations sur l'entreprise JammShop et obligations légales.",
  keywords: "mentions légales, JammShop, informations légales, entreprise",
}

export default function LegalPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Informations légales
            </Badge>
            <h1 className="text-4xl font-bold mb-6">Mentions Légales</h1>
            <p className="text-xl text-muted-foreground">
              Informations légales concernant JammShop et son exploitation
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Éditeur du site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Raison socia :</</strong> JammShop Snew
                  <br />
                  <strong>Forme juridique :</strong> Société par Actions Simplifiée
                  <br />
                  <strong>Capital social :</strong> 100 000 €<br />
                  <strong>RCS :</strong> Paris B 123 456 789
                  <br />
                  <strong>SIRET :</strong> 123 456 789 00012
                  <br />
                  <strong>TVA intracommunautaire :</strong> FR12 123456789
                </div>

                <div>
                  <strong>Siège social :</strong>
                  <br />
                  123 Rue du Commerce
                  <br />
                  75001 Paris, France
                </div>

                <div>
                  <strong>Directeur de la publication :</strong> Marie Dubois
                  <br />
                  <strong>Email :</strong> contact@jammshop.com
                  <br />
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hébergement</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <strong>Hébergeur :</strong> Vercel Inc.
                  <br />
                  <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
                  <br />
                  <strong>Site web :</strong>{" "}
                  <a href="https://vercel.com" className="text-blue-600 hover:underline">
                    vercel.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propriété intellectuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la
                  propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents
                  téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est
                  formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p>
                  Les marques et logos figurant sur le site sont déposés par DjigaFlow ou éventuellement par ses
                  partenaires. Toute reproduction totale ou partielle de ces marques ou de ces logos effectuée à partir
                  des éléments du site sans l'autorisation expresse de DjigaFlow est donc prohibée.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à
                  différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir
                  le signaler par email, à l'adresse contact@djigaflow.com, en décrivant le problème de la manière la
                  plus précise possible.
                </p>
                <p>
                  DjigaFlow ne pourra être tenue responsable des dommages directs et indirects causés au matériel de
                  l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant
                  pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liens hypertextes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Des liens hypertextes peuvent être présents sur le site. L'utilisateur est informé qu'en cliquant sur
                  ces liens, il sortira du site djigaflow.com. Ce dernier n'a pas de contrôle sur les pages web sur
                  lesquelles aboutissent ces liens et ne saurait, en aucun cas, être responsable de leur contenu.
                </p>
                <p>
                  La création de liens hypertextes vers le site djigaflow.com ne peut être faite qu'avec l'autorisation
                  écrite préalable de DjigaFlow.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Droit applicable et juridiction compétente</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tout litige en relation avec l'utilisation du site djigaflow.com est soumis au droit français. Il est
                  fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Par email : contact@djigaflow.com</li>
                  <li>Par téléphone : +33 1 23 45 67 89</li>
                  <li>Par courrier : 123 Rue du Commerce, 75001 Paris, France</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
