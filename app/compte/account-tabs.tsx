"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { User, Package, Heart, CreditCard, MapPin, Bell, LogOut } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function AccountTabs() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simuler une mise à jour
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    })

    setIsUpdating(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  // Données simulées pour les commandes
  const orders = [
    {
      id: "ORD-123456",
      date: "2023-05-15",
      status: "Livrée",
      total: 89.9,
      items: 3,
    },
    {
      id: "ORD-789012",
      date: "2023-04-28",
      status: "En cours de livraison",
      total: 124.5,
      items: 2,
    },
    {
      id: "ORD-345678",
      date: "2023-03-10",
      status: "Livrée",
      total: 45.8,
      items: 1,
    },
  ]

  // Données simulées pour la liste de souhaits
  const wishlist = [
    {
      id: "prod-1",
      name: "Montre connectée",
      price: 129.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "prod-2",
      name: "Écouteurs sans fil",
      price: 79.99,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "prod-3",
      name: "Batterie externe",
      price: 49.99,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Données simulées pour les adresses
  const addresses = [
    {
      id: "addr-1",
      name: "Domicile",
      address: "123 Rue de Paris",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Bureau",
      address: "45 Avenue des Champs-Élysées",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      isDefault: false,
    },
  ]

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Vous n'êtes pas connecté</h2>
        <p className="text-muted-foreground mb-6">Veuillez vous connecter pour accéder à votre compte.</p>
        <Button asChild>
          <Link href="/connexion">Se connecter</Link>
        </Button>
      </div>
    )
  }

  // Handler pour changement d'onglet (si besoin d'une action)
  const handleTabChange = (value: string) => {
    // Exemple : console.log("Onglet sélectionné :", value)
  }

  return (
    <Tabs defaultValue="profile" className="w-full" onValueChange={handleTabChange}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 space-y-1">
          <TabsList className="flex flex-col h-auto bg-transparent p-0 justify-start">
            <TabsTrigger value="profile" className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="orders" className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
              <Package className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted"
            >
              <Heart className="h-4 w-4 mr-2" />
              Liste de souhaits
            </TabsTrigger>
            <TabsTrigger value="payment" className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted">
              <CreditCard className="h-4 w-4 mr-2" />
              Moyens de paiement
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Adresses
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start px-3 py-2 h-auto data-[state=active]:bg-muted"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="flex-1">
          <TabsContent value="profile" className="mt-0">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Mon profil</h2>
                <p className="text-muted-foreground mb-6">Gérez vos informations personnelles et vos préférences.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleProfileChange} />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
                </Button>
              </form>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Changer de mot de passe</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button type="submit">Changer le mot de passe</Button>
                </form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Mes commandes</h2>
              <p className="text-muted-foreground mb-6">Consultez l'historique et le statut de vos commandes.</p>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <Badge variant={order.status === "Livrée" ? "outline" : "default"}>{order.status}</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">
                            {order.items} article{order.items > 1 ? "s" : ""}
                          </p>
                          <p className="font-semibold">{order.total.toFixed(2)} €</p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/compte/commandes/${order.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                  <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande.</p>
                  <Button asChild>
                    <Link href="/catalogue">Découvrir nos produits</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ma liste de souhaits</h2>
              <p className="text-muted-foreground mb-6">
                Gérez les produits que vous avez ajoutés à votre liste de souhaits.
              </p>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 rounded overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              <Link href={`/produit/${product.id}`} className="hover:underline">
                                {product.name}
                              </Link>
                            </h3>
                            <p className="font-medium">{product.price.toFixed(2)} €</p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm">Ajouter au panier</Button>
                              <Button size="sm" variant="outline">
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Liste de souhaits vide</h3>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore ajouté de produits à votre liste de souhaits.
                  </p>
                  <Button asChild>
                    <Link href="/catalogue">Découvrir nos produits</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Moyens de paiement</h2>
              <p className="text-muted-foreground mb-6">Gérez vos cartes bancaires et autres moyens de paiement.</p>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Visa se terminant par 4242</h3>
                          <p className="text-sm text-muted-foreground">Expire le 12/25</p>
                        </div>
                      </div>
                      <Badge>Par défaut</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted p-2 rounded">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Mastercard se terminant par 5678</h3>
                          <p className="text-sm text-muted-foreground">Expire le 09/24</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Définir par défaut
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full">Ajouter un moyen de paiement</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Mes adresses</h2>
              <p className="text-muted-foreground mb-6">Gérez vos adresses de livraison et de facturation.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{address.name}</h3>
                        {address.isDefault && <Badge>Par défaut</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>{address.address}</p>
                        <p>
                          {address.postalCode} {address.city}
                        </p>
                        <p>{address.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                        {!address.isDefault && (
                          <>
                            <Button size="sm" variant="outline">
                              Définir par défaut
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                              Supprimer
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button>Ajouter une adresse</Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Préférences de notification</h2>
              <p className="text-muted-foreground mb-6">Gérez vos préférences de notification par email et SMS.</p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notifications par email</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Commandes et livraisons</p>
                      <p className="text-sm text-muted-foreground">
                        Confirmations de commande, mises à jour de livraison
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promotions et offres</p>
                      <p className="text-sm text-muted-foreground">Offres spéciales, réductions, nouveaux produits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Avis et enquêtes</p>
                      <p className="text-sm text-muted-foreground">Demandes d'avis, enquêtes de satisfaction</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Notifications par SMS</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mises à jour de livraison</p>
                      <p className="text-sm text-muted-foreground">Notifications de statut de livraison</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Offres flash</p>
                      <p className="text-sm text-muted-foreground">Promotions limitées dans le temps</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button>Enregistrer les préférences</Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}
