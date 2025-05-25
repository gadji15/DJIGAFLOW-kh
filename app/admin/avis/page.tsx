import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Star, Search, Filter, Eye, Check, X, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react"

const reviews = [
  {
    id: 1,
    customer: {
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: {
      name: "iPhone 15 Pro",
      image: "/placeholder.svg?height=60&width=60",
    },
    rating: 5,
    title: "Excellent produit !",
    comment:
      "Très satisfaite de mon achat. Livraison rapide et produit conforme à la description. Je recommande vivement !",
    status: "pending",
    created_at: "2024-01-20",
    helpful_votes: 12,
  },
  {
    id: 2,
    customer: {
      name: "Jean Martin",
      email: "jean.martin@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: {
      name: "MacBook Air M2",
      image: "/placeholder.svg?height=60&width=60",
    },
    rating: 4,
    title: "Bon rapport qualité-prix",
    comment: "Ordinateur performant, parfait pour le travail. Seul bémol : l'autonomie pourrait être meilleure.",
    status: "approved",
    created_at: "2024-01-19",
    helpful_votes: 8,
  },
  {
    id: 3,
    customer: {
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: {
      name: "AirPods Pro",
      image: "/placeholder.svg?height=60&width=60",
    },
    rating: 2,
    title: "Déçue de l'achat",
    comment: "La qualité audio n'est pas au rendez-vous. J'ai eu des problèmes de connexion dès le premier jour.",
    status: "pending",
    created_at: "2024-01-18",
    helpful_votes: 3,
  },
]

const stats = [
  { label: "Avis total", value: "1,234", icon: MessageSquare, color: "blue" },
  { label: "En attente", value: "23", icon: AlertTriangle, color: "orange" },
  { label: "Note moyenne", value: "4.2", icon: Star, color: "yellow" },
  { label: "Taux d'approbation", value: "94%", icon: TrendingUp, color: "green" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approuvé</Badge>
    case "pending":
      return <Badge variant="secondary">En attente</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejeté</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Avis clients</h1>
          <p className="text-gray-600 dark:text-gray-400">Modérez et gérez les avis produits</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <Icon className={`h-8 w-8 text-${stat.color}-500`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les avis..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <select className="border rounded px-3 py-2 bg-background min-w-[120px]">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select className="border rounded px-3 py-2 bg-background min-w-[120px]">
            <option value="">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {review.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{review.customer.name}</h4>
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground">{review.created_at}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(review.status)}</div>
                </div>

                {/* Product */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                    <img
                      src={review.product.image || "/placeholder.svg"}
                      alt={review.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{review.product.name}</p>
                    <p className="text-sm text-muted-foreground">Produit évalué</p>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h5 className="font-semibold mb-2">{review.title}</h5>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{review.helpful_votes} personnes ont trouvé cet avis utile</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    {review.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Approuver
                        </Button>
                        <Button variant="destructive" size="sm">
                          <X className="h-3 w-3 mr-1" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <Button variant="default" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
