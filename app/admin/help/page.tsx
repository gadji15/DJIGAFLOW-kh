"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Download,
  Play,
  Clock,
  Zap,
  Shield,
  Settings,
  BarChart3,
  Package,
  ShoppingCart,
  Code,
  Eye,
  Share,
} from "lucide-react"

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number
  views: number
  likes: number
  dislikes: number
  lastUpdated: Date
  author: string
  type: "article" | "video" | "tutorial" | "faq"
  videoUrl?: string
  attachments?: string[]
}

interface HelpCategory {
  id: string
  name: string
  description: string
  icon: any
  color: string
  articleCount: number
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Premiers pas",
    description: "Découvrez les bases de JammShop",
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-800",
    articleCount: 12,
  },
  {
    id: "products",
    name: "Gestion des produits",
    description: "Ajoutez et gérez votre catalogue",
    icon: Package,
    color: "bg-green-100 text-green-800",
    articleCount: 18,
  },
  {
    id: "orders",
    name: "Commandes",
    description: "Traitez et suivez les commandes",
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-800",
    articleCount: 15,
  },
  {
    id: "automation",
    name: "Automatisation",
    description: "Automatisez vos processus",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-800",
    articleCount: 8,
  },
  {
    id: "analytics",
    name: "Analytique",
    description: "Analysez vos performances",
    icon: BarChart3,
    color: "bg-orange-100 text-orange-800",
    articleCount: 10,
  },
  {
    id: "security",
    name: "Sécurité",
    description: "Protégez votre boutique",
    icon: Shield,
    color: "bg-red-100 text-red-800",
    articleCount: 6,
  },
  {
    id: "api",
    name: "API & Intégrations",
    description: "Connectez des services externes",
    icon: Code,
    color: "bg-gray-100 text-gray-800",
    articleCount: 14,
  },
  {
    id: "troubleshooting",
    name: "Dépannage",
    description: "Résolvez les problèmes courants",
    icon: Settings,
    color: "bg-indigo-100 text-indigo-800",
    articleCount: 22,
  },
]

const mockArticles: HelpArticle[] = [
  {
    id: "1",
    title: "Comment créer votre première boutique",
    content: "Guide complet pour configurer votre boutique JammShop...",
    category: "getting-started",
    tags: ["boutique", "configuration", "débutant"],
    difficulty: "beginner",
    estimatedTime: 15,
    views: 2847,
    likes: 156,
    dislikes: 8,
    lastUpdated: new Date("2024-01-15"),
    author: "Équipe JammShop",
    type: "tutorial",
  },
  {
    id: "2",
    title: "Synchronisation automatique des stocks",
    content: "Apprenez à configurer la synchronisation automatique...",
    category: "automation",
    tags: ["stock", "synchronisation", "automatisation"],
    difficulty: "intermediate",
    estimatedTime: 25,
    views: 1923,
    likes: 89,
    dislikes: 3,
    lastUpdated: new Date("2024-01-18"),
    author: "Expert Technique",
    type: "video",
    videoUrl: "https://example.com/video1",
  },
  {
    id: "3",
    title: "Optimiser les performances de votre boutique",
    content: "Techniques avancées pour améliorer les performances...",
    category: "troubleshooting",
    tags: ["performance", "optimisation", "vitesse"],
    difficulty: "advanced",
    estimatedTime: 45,
    views: 1456,
    likes: 78,
    dislikes: 5,
    lastUpdated: new Date("2024-01-20"),
    author: "Développeur Senior",
    type: "article",
  },
]

const faqItems = [
  {
    question: "Comment puis-je ajouter un nouveau produit ?",
    answer:
      "Pour ajouter un nouveau produit, allez dans 'Produits' > 'Ajouter un produit' et remplissez les informations requises.",
    category: "products",
  },
  {
    question: "Pourquoi ma synchronisation échoue-t-elle ?",
    answer: "Vérifiez vos clés API et assurez-vous que vos fournisseurs sont correctement configurés.",
    category: "troubleshooting",
  },
  {
    question: "Comment configurer les emails automatiques ?",
    answer: "Rendez-vous dans 'Automatisation' > 'Email Marketing' pour configurer vos campagnes automatiques.",
    category: "automation",
  },
]

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)

  // Filtrer les articles
  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Centre d'aide JammShop</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Trouvez des réponses, apprenez les meilleures pratiques et maîtrisez votre plateforme
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher dans la documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Parcourir</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Catégories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon
              return (
                <motion.div key={category.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all duration-200",
                      selectedCategory === category.id && "ring-2 ring-blue-500",
                    )}
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {category.articleCount} articles
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquemment posées</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArticles
              .filter((a) => a.type === "video")
              .map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContactCard
              icon={MessageCircle}
              title="Chat en direct"
              description="Obtenez une aide immédiate"
              action="Démarrer le chat"
              color="bg-blue-100 text-blue-800"
            />
            <ContactCard
              icon={Mail}
              title="Support par email"
              description="Envoyez-nous vos questions"
              action="Envoyer un email"
              color="bg-green-100 text-green-800"
            />
            <ContactCard
              icon={Phone}
              title="Support téléphonique"
              description="Appelez notre équipe"
              action="Voir les horaires"
              color="bg-purple-100 text-purple-800"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal d'article */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ArticleViewer article={selectedArticle} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Composant pour les cartes d'articles
function ArticleCard({ article, onClick }: { article: HelpArticle; onClick: () => void }) {
  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  }

  const typeIcons = {
    article: FileText,
    video: Video,
    tutorial: Book,
    faq: HelpCircle,
  }

  const TypeIcon = typeIcons[article.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={onClick}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-5 w-5 text-blue-600" />
                <Badge className={cn("text-xs", difficultyColors[article.difficulty])}>{article.difficulty}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{article.estimatedTime} min</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{article.content}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{article.likes}</span>
                </div>
              </div>
              <span>Par {article.author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Composant pour les cartes vidéo
function VideoCard({ video }: { video: HelpArticle }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.estimatedTime} min
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{video.views.toLocaleString()} vues</span>
          <span>{video.lastUpdated.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Composant pour les cartes de contact
function ContactCard({
  icon: Icon,
  title,
  description,
  action,
  color,
}: {
  icon: any
  title: string
  description: string
  action: string
  color: string
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <Button className="w-full">{action}</Button>
      </CardContent>
    </Card>
  )
}

// Composant pour visualiser un article
function ArticleViewer({ article }: { article: HelpArticle }) {
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  return (
    <div className="space-y-6">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{article.type}</Badge>
          <Badge
            className={cn(
              "text-xs",
              article.difficulty === "beginner" && "bg-green-100 text-green-800",
              article.difficulty === "intermediate" && "bg-yellow-100 text-yellow-800",
              article.difficulty === "advanced" && "bg-red-100 text-red-800",
            )}
          >
            {article.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{article.estimatedTime} min</span>
          </div>
        </div>
        <DialogTitle className="text-2xl">{article.title}</DialogTitle>
        <DialogDescription>
          Par {article.author} • Mis à jour le {article.lastUpdated.toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>

      <div className="prose dark:prose-invert max-w-none">
        <p>{article.content}</p>
        {/* Ici vous pourriez ajouter le contenu complet de l'article */}
      </div>

      {article.videoUrl && (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Vidéo explicative</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Cet article vous a-t-il été utile ?</span>
          <div className="flex items-center gap-2">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLiked(!liked)
                if (disliked) setDisliked(false)
              }}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {article.likes + (liked ? 1 : 0)}
            </Button>
            <Button
              variant={disliked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDisliked(!disliked)
                if (liked) setLiked(false)
              }}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {article.dislikes + (disliked ? 1 : 0)}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-1" />
            Partager
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
