import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Store, Mail, Shield, Database } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Boutique
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nom du site</Label>
                  <Input id="site-name" defaultValue="JammShop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">URL du site</Label>
                  <Input id="site-url" defaultValue="https://jammshop.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Description du site</Label>
                <Input id="site-description" defaultValue="Votre boutique de dropshipping" />
              </div>

              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la boutique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Input id="currency" defaultValue="EUR" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Taux de TVA (%)</Label>
                  <Input id="tax-rate" defaultValue="20" type="number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-cost">Frais de livraison (€)</Label>
                  <Input id="shipping-cost" defaultValue="5.99" type="number" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-shipping">Livraison gratuite à partir de (€)</Label>
                  <Input id="free-shipping" defaultValue="50" type="number" step="0.01" />
                </div>
              </div>

              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuration email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Serveur SMTP</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port SMTP</Label>
                  <Input id="smtp-port" defaultValue="587" type="number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">Utilisateur SMTP</Label>
                  <Input id="smtp-user" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Mot de passe SMTP</Label>
                  <Input id="smtp-password" type="password" />
                </div>
              </div>

              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Délai d'expiration de session (minutes)</Label>
                <Input id="session-timeout" defaultValue="30" type="number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Tentatives de connexion max</Label>
                <Input id="max-login-attempts" defaultValue="5" type="number" />
              </div>

              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de la base de données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button variant="outline">Sauvegarder la base</Button>
                <Button variant="outline">Restaurer la base</Button>
                <Button variant="destructive">Vider le cache</Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Dernière sauvegarde: 15/01/2024 à 14:30</p>
                <p>Taille de la base: 45.2 MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
