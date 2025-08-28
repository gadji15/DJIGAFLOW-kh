"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Clock,
  ImageIcon,
  BarChart3,
  Download,
  Upload,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  CheckCircle,
  XCircle,
  Copy,
  Layers,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react"

interface ContentItem {
  id: string
  title: string
  type: "page" | "article" | "banner" | "popup" | "email" | "sms"
  status: "draft" | "published" | "scheduled" | "archived"
  content: string
  excerpt?: string
  author: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  scheduledAt?: Date
  tags: string[]
  category: string
  views: number
  engagement: number
  seoScore: number
  isTemplate: boolean
  language: string
  targetAudience: string[]
  devices: string[]
  priority: number
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Page d'accueil - Hero Section",
    type: "page",
    status: "published",
    content: "<h1>Bienvenue sur JammShop</h1><p>Votre plateforme de dropshipping...</p>",
    excerpt: "Section principale de la page d'accueil",
    author: "Admin",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    publishedAt: new Date("2024-01-20"),
    tags: ["accueil", "hero", "principal"],
    category: "Pages",
    views: 15420,
    engagement: 85,
    seoScore: 92,
    isTemplate: false,
    language: "fr",
    targetAudience: ["tous"],
    devices: ["desktop", "mobile", "tablet"],
    priority: 10,
  },
  {
    id: "2",
    title: "Bannière Promotion Black Friday",
    type: "banner",
    status: "scheduled",
    content: "<div class='banner'>🔥 Black Friday - 50% de réduction!</div>",
    excerpt: "Bannière promotionnelle pour le Black Friday",
    author: "Marketing",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    scheduledAt: new Date("2024-11-25"),
    tags: ["promotion", "black friday", "bannière"],
    category: "Marketing",
    views: 0,
    engagement: 0,
    seoScore: 78,
    isTemplate: true,
    language: "fr",
    targetAudience: ["clients", "prospects"],
    devices: ["desktop", "mobile"],
    priority: 8,
  },
  {
    id: "3",
    title: "Email de bienvenue nouveaux clients",
    type: "email",
    status: "published",
    content: "Bonjour {{nom}}, bienvenue sur JammShop...",
    excerpt: "Email automatique pour les nouveaux inscrits",
    author: "CRM",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-15"),
    publishedAt: new Date("2024-01-15"),
    tags: ["email", "bienvenue", "automation"],
    category: "Automation",
    views: 2340,
    engagement: 67,
    seoScore: 0,
    isTemplate: true,
    language: "fr",
    targetAudience: ["nouveaux clients"],
    devices: ["email"],
    priority: 7,
  },
]

const contentTypes = [
  { value: "page", label: "Page Web", icon: FileText },
  { value: "article", label: "Article", icon: FileText },
  { value: "banner", label: "Bannière", icon: ImageIcon },
  { value: "popup", label: "Pop-up", icon: Layers },
  { value: "email", label: "Email", icon: FileText },
  { value: "sms", label: "SMS", icon: FileText },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  archived: "bg-red-100 text-red-800",
}

const statusIcons = {
  draft: Edit,
  published: CheckCircle,
  scheduled: Clock,
  archived: XCircle,
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filtrer et trier le contenu
  const filteredContent = content
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = filterType === "all" || item.type === filterType
      const matchesStatus = filterStatus === "all" || item.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof ContentItem]
      const bValue = b[sortBy as keyof ContentItem]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSave = (updatedContent: ContentItem) => {
    setContent((prev) => prev.map((item) => (item.id === updatedContent.id ? updatedContent : item)))
    setIsEditing(false)
    setSelectedContent(null)
  }

  const handleDelete = (id: string) => {
    setContent((prev) => prev.filter((item) => item.id !== id))
  }

  const handleDuplicate = (item: ContentItem) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copie)`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      views: 0,
      engagement: 0,
    }
    setContent((prev) => [newItem, ...prev])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion de Contenu</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Créez et gérez tout votre contenu en temps réel</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contenu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ContentEditor content={null} onSave={handleSave} onCancel={() => {}} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total contenu</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{content.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publié</p>
                <p className="text-2xl font-bold text-green-600">
                  {content.filter((item) => item.status === "published").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Programmé</p>
                <p className="text-2xl font-bold text-blue-600">
                  {content.filter((item) => item.status === "scheduled").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Brouillons</p>
                <p className="text-2xl font-bold text-gray-600">
                  {content.filter((item) => item.status === "draft").length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher du contenu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="scheduled">Programmé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Modifié</SelectItem>
                  <SelectItem value="createdAt">Créé</SelectItem>
                  <SelectItem value="title">Titre</SelectItem>
                  <SelectItem value="views">Vues</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste/Grille de contenu */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onEdit={() => {
                  setSelectedContent(item)
                  setIsEditing(true)
                }}
                onDelete={() => handleDelete(item.id)}
                onDuplicate={() => handleDuplicate(item)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ContentTable
              content={filteredContent}
              onEdit={(item) => {
                setSelectedContent(item)
                setIsEditing(true)
              }}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Éditeur de contenu */}
      {isEditing && selectedContent && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <ContentEditor
              content={selectedContent}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false)
                setSelectedContent(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Composant Card pour la vue grille
function ContentCard({
  content,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  content: ContentItem
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const StatusIcon = statusIcons[content.status]
  const typeConfig = contentTypes.find((t) => t.value === content.type)
  const TypeIcon = typeConfig?.icon || FileText

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-blue-600" />
              <Badge variant="outline" className="text-xs">
                {typeConfig?.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDuplicate}>
                <Copy className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le contenu</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{content.title}" ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{content.title}</h3>
            {content.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{content.excerpt}</p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Statut */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <Badge className={cn("text-xs", statusColors[content.status])}>
                  {content.status === "draft" && "Brouillon"}
                  {content.status === "published" && "Publié"}
                  {content.status === "scheduled" && "Programmé"}
                  {content.status === "archived" && "Archivé"}
                </Badge>
              </div>
              {content.isTemplate && (
                <Badge variant="secondary" className="text-xs">
                  Template
                </Badge>
              )}
            </div>

            {/* Tags */}
            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {content.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {content.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{content.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Métriques */}
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{content.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                <span>{content.engagement}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                <span>{content.seoScore}/100</span>
              </div>
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div>Modifié: {content.updatedAt.toLocaleDateString()}</div>
              {content.scheduledAt && <div>Programmé: {content.scheduledAt.toLocaleDateString()}</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Composant Table pour la vue liste
function ContentTable({
  content,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  content: ContentItem[]
  onEdit: (item: ContentItem) => void
  onDelete: (id: string) => void
  onDuplicate: (item: ContentItem) => void
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr className="text-left">
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Titre</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Type</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Statut</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Auteur</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Modifié</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Vues</th>
                <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => {
                const StatusIcon = statusIcons[item.status]
                const typeConfig = contentTypes.find((t) => t.value === item.type)
                const TypeIcon = typeConfig?.icon || FileText

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
                        {item.excerpt && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                            {item.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{typeConfig?.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={cn("text-xs", statusColors[item.status])}>
                          {item.status === "draft" && "Brouillon"}
                          {item.status === "published" && "Publié"}
                          {item.status === "scheduled" && "Programmé"}
                          {item.status === "archived" && "Archivé"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.author}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.views.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDuplicate(item)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le contenu</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{item.title}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(item.id)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Éditeur de contenu avancé
function ContentEditor({
  content,
  onSave,
  onCancel,
}: {
  content: ContentItem | null
  onSave: (content: ContentItem) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<ContentItem>>(
    content || {
      title: "",
      type: "page",
      status: "draft",
      content: "",
      excerpt: "",
      author: "Admin",
      tags: [],
      category: "",
      language: "fr",
      targetAudience: [],
      devices: ["desktop", "mobile", "tablet"],
      priority: 5,
      isTemplate: false,
    },
  )

  const [activeTab, setActiveTab] = useState("content")
  const [previewDevice, setPreviewDevice] = useState("desktop")

  const handleSave = () => {
    const now = new Date()
    const savedContent: ContentItem = {
      id: content?.id || Date.now().toString(),
      title: formData.title || "",
      type: formData.type || "page",
      status: formData.status || "draft",
      content: formData.content || "",
      excerpt: formData.excerpt,
      author: formData.author || "Admin",
      createdAt: content?.createdAt || now,
      updatedAt: now,
      publishedAt: formData.status === "published" ? now : content?.publishedAt,
      scheduledAt: formData.scheduledAt,
      tags: formData.tags || [],
      category: formData.category || "",
      views: content?.views || 0,
      engagement: content?.engagement || 0,
      seoScore: content?.seoScore || 0,
      isTemplate: formData.isTemplate || false,
      language: formData.language || "fr",
      targetAudience: formData.targetAudience || [],
      devices: formData.devices || ["desktop", "mobile", "tablet"],
      priority: formData.priority || 5,
    }

    onSave(savedContent)
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>{content ? "Modifier le contenu" : "Nouveau contenu"}</DialogTitle>
        <DialogDescription>Créez ou modifiez votre contenu avec l'éditeur avancé</DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre du contenu"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Résumé du contenu"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu principal"
                  rows={12}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Catégorie du contenu"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={formData.tags?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="template"
                  checked={formData.isTemplate || false}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isTemplate: checked }))}
                />
                <Label htmlFor="template">Utiliser comme template</Label>
              </div>

              {formData.status === "scheduled" && (
                <div>
                  <Label htmlFor="scheduledAt">Date de publication</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt?.toISOString().slice(0, 16) || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduledAt: e.target.value ? new Date(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ciblage</h3>

              <div>
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Audience cible</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["tous", "clients", "prospects", "nouveaux clients", "VIP"].map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={audience}
                        checked={formData.targetAudience?.includes(audience) || false}
                        onChange={(e) => {
                          const audiences = formData.targetAudience || []
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              targetAudience: [...audiences, audience],
                            }))
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              targetAudience: audiences.filter((a) => a !== audience),
                            }))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={audience} className="text-sm">
                        {audience}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appareils</h3>

              <div>
                <Label>Appareils supportés</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    { value: "desktop", label: "Desktop", icon: Monitor },
                    { value: "tablet", label: "Tablette", icon: Tablet },
                    { value: "mobile", label: "Mobile", icon: Smartphone },
                  ].map((device) => {
                    const Icon = device.icon
                    return (
                      <div key={device.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={device.value}
                          checked={formData.devices?.includes(device.value) || false}
                          onChange={(e) => {
                            const devices = formData.devices || []
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                devices: [...devices, device.value],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                devices: devices.filter((d) => d !== device.value),
                              }))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Icon className="h-4 w-4" />
                        <Label htmlFor={device.value} className="text-sm">
                          {device.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Priorité (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority || 5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: Number.parseInt(e.target.value) || 5,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Optimisation SEO</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="metaTitle">Titre Meta</Label>
                <Input id="metaTitle" placeholder="Titre pour les moteurs de recherche" maxLength={60} />
                <p className="text-xs text-gray-500 mt-1">Recommandé: 50-60 caractères</p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Description Meta</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">Recommandé: 150-160 caractères</p>
              </div>

              <div>
                <Label htmlFor="keywords">Mots-clés SEO</Label>
                <Input id="keywords" placeholder="mot-clé1, mot-clé2, mot-clé3" />
              </div>

              <div>
                <Label htmlFor="canonicalUrl">URL Canonique</Label>
                <Input id="canonicalUrl" placeholder="https://example.com/page" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">85</div>
                  <div className="text-sm text-gray-600">Score SEO</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">92</div>
                  <div className="text-sm text-gray-600">Lisibilité</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">78</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Aperçu du contenu</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewDevice === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "border rounded-lg p-4 bg-white dark:bg-gray-900 transition-all",
                previewDevice === "mobile" && "max-w-sm mx-auto",
                previewDevice === "tablet" && "max-w-2xl mx-auto",
                previewDevice === "desktop" && "w-full",
              )}
            >
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{formData.title || "Titre du contenu"}</h1>
                {formData.excerpt && <p className="text-gray-600 dark:text-gray-400">{formData.excerpt}</p>}
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formData.content || "Contenu à prévisualiser..." }} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  )
}
