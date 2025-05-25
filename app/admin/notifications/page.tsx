"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  Check,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  Volume2,
  VolumeX,
  Filter,
  Search,
  Trash2,
  Star,
  Send,
  Users,
  Zap,
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "system" | "order" | "user" | "security" | "marketing"
  priority: "low" | "medium" | "high" | "urgent"
  isRead: boolean
  isStarred: boolean
  timestamp: Date
  sender?: string
  actions?: {
    label: string
    action: string
    variant?: "default" | "outline" | "destructive"
  }[]
  metadata?: Record<string, any>
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  sound: boolean
  categories: Record<string, boolean>
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouvelle commande reçue",
    message: "Commande #12345 d'un montant de 89,99€ vient d'être passée par Marie Martin",
    type: "success",
    category: "order",
    priority: "medium",
    isRead: false,
    isStarred: false,
    timestamp: new Date("2024-01-20T14:30:00"),
    sender: "Système de commandes",
    actions: [
      { label: "Voir la commande", action: "view_order", variant: "default" },
      { label: "Traiter", action: "process_order", variant: "outline" },
    ],
    metadata: { orderId: "12345", amount: 89.99, customer: "Marie Martin" },
  },
  {
    id: "2",
    title: "Alerte de sécurité",
    message: "Tentative de connexion suspecte détectée depuis l'IP 45.123.45.67",
    type: "warning",
    category: "security",
    priority: "high",
    isRead: false,
    isStarred: true,
    timestamp: new Date("2024-01-20T14:15:00"),
    sender: "Système de sécurité",
    actions: [
      { label: "Enquêter", action: "investigate", variant: "default" },
      { label: "Bloquer IP", action: "block_ip", variant: "destructive" },
    ],
    metadata: { ip: "45.123.45.67", attempts: 5 },
  },
  {
    id: "3",
    title: "Stock faible",
    message: "Le produit 'iPhone 15 Pro' n'a plus que 3 unités en stock",
    type: "warning",
    category: "system",
    priority: "medium",
    isRead: true,
    isStarred: false,
    timestamp: new Date("2024-01-20T13:45:00"),
    sender: "Gestion des stocks",
    actions: [{ label: "Réapprovisionner", action: "restock", variant: "default" }],
    metadata: { productId: "iphone-15-pro", stock: 3 },
  },
  {
    id: "4",
    title: "Nouvel utilisateur inscrit",
    message: "Pierre Durand vient de créer un compte sur votre plateforme",
    type: "info",
    category: "user",
    priority: "low",
    isRead: true,
    isStarred: false,
    timestamp: new Date("2024-01-20T12:30:00"),
    sender: "Système d'inscription",
    actions: [{ label: "Voir le profil", action: "view_profile", variant: "outline" }],
    metadata: { userId: "pierre-durand", email: "pierre.durand@example.com" },
  },
  {
    id: "5",
    title: "Campagne email terminée",
    message: "La campagne 'Promotion Janvier' a été envoyée à 1,247 destinataires",
    type: "success",
    category: "marketing",
    priority: "low",
    isRead: false,
    isStarred: false,
    timestamp: new Date("2024-01-20T11:00:00"),
    sender: "Marketing automation",
    actions: [{ label: "Voir les résultats", action: "view_results", variant: "outline" }],
    metadata: { campaignId: "promo-janvier", recipients: 1247 },
  },
]

const typeColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  success: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
}

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const categoryIcons = {
  system: Settings,
  order: CheckCircle,
  user: Users,
  security: AlertTriangle,
  marketing: Send,
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    sound: true,
    categories: {
      system: true,
      order: true,
      user: true,
      security: true,
      marketing: false,
    }
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterRead, setFilterRead] = useState<string>("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  // Statistiques
  const totalNotifications = notifications.length
  const unreadNotifications = notifications.filter(n => !n.isRead).length
  const urgentNotifications = notifications.filter(n => n.priority === "urgent").length
  const starredNotifications = notifications.filter(n => n.isStarred).length

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesCategory = filterCategory === "all" || notification.category === filterCategory
    const matchesRead = 
      filterRead === "all" || 
      (filterRead === "read" && notification.isRead) ||
      (filterRead === "unread" && !notification.isRead)

    return matchesSearch && matchesType && matchesCategory && matchesRead
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
  }

  const toggleStar = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isStarred: !notification.isStarred }
        : notification
    ))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)))
    setSelectedNotifications([])
  }

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id)
    setSelectedNotifications(visibleIds)
  }

  // Simulation de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% de chance toutes les 10 secondes
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "Nouvelle notification",
          message: "Ceci est une notification de test générée automatiquement",
          type: ["info", "success", "warning"][Math.floor(Math.random() * 3)] as any,
          category: ["system", "order", "user"][Math.floor(Math.random() * 3)] as any,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          isRead: false,
          isStarred: false,
          timestamp: new Date(),
          sender: "Système de test"
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Centre de notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez toutes vos notifications et alertes en temps réel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          {selectedNotifications.length > 0 && (
            <Button variant="outline" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer ({selectedNotifications.length})
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalNotifications}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Non lues</p>
                <p className="text-2xl font-bold text-orange-600">{unreadNotifications}</p>
              </div>
              <BellRing className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgentes</p>
                <p className="text-2xl font-bold text-red-600">{urgentNotifications}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorites</p>
                <p className="text-2xl font-bold text-yellow-600">{starredNotifications}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher des notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="warning">Avertissement</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="order">Commandes</SelectItem>
                      <SelectItem value="user">Utilisateurs</SelectItem>
                      <SelectItem value="security">Sécurité</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterRead} onValueChange={setFilterRead}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="unread">Non lues</SelectItem>
                      <SelectItem value="read">Lues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllVisible}>
                    Tout sélectionner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des notifications */}
          <div className="space-y-2">
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const TypeIcon = typeIcons[notification.type]
                const CategoryIcon = categoryIcons[notification.category]
                const isSelected = selectedNotifications.includes(notification.id)

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`group ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                  >
                    <Card className={`hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectNotification(notification.id)}
                              className="rounded border-gray-300"
                            />
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors[notification.type]}`}>
                              <TypeIcon className="h-5 w-5" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''} text-gray-900 dark:text-gray-100`}>
                                    {notification.title}
                                  </h3>
                                  <Badge className={typeColors[notification.type]}>
                                    {notification.type}
                                  </Badge>
                                  <Badge className={priorityColors[notification.priority]}>
                                    {notification.priority}
                                  </Badge>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <CategoryIcon className="h-3 w-3" />
                                    <span>{notification.category}</span>
                                  </div>
                                  {notification.sender && (
                                    <span>Par {notification.sender}</span>
                                  )}
                                  <span>{notification.timestamp.toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleStar(notification.id)}
                                  className={notification.isStarred ? 'text-yellow-600' : ''}
                                >
                                  <Star className={`h-4 w-4 ${notification.isStarred ? 'fill-current' : ''}`} />
                                </Button>
                                
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={action.variant || "outline"}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aucune notification ne correspond à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Canaux de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recevoir les notifications par email
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.email} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <Label>Push</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Notifications push sur mobile
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.push} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label>SMS</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Notifications par SMS (urgentes uniquement)
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.sms} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label>In-App</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Notifications dans l'application
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.inApp} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, inApp: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.sound ? (
                      <Volume2 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <Label>Son</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Son pour les notifications
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.sound} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sound: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Catégories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.categories).map(([category, enabled]) => {
                  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Label className="capitalize">{category}</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Notifications de {category}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={enabled} 
                        onCheckedChange={(checked) => setSettings(prev => ({ 
                          ...prev, 
                          categories: { ...prev.categories, [category]: checked }
                        }))}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horaires de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heure de début</Label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Heure de fin</Label>
                    <Input type="time" defaultValue="22:00" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Jours actifs</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                      <Button key={day} variant="outline" size="sm">
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode Ne pas déranger</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Suspendre toutes les notifications non urgentes
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Templates de notification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Nouvelle commande",
                    description: "Notification envoyée lors d'une nouvelle commande",
                    category: "order",
                    enabled: true
                  },
                  {
                    name: "Stock faible",
                    description: "Alerte quand le stock d'un produit est bas",
                    category: "system",
                    enabled: true
                  },
                  {
                    name: "Nouvel utilisateur",
                    description: "Notification d'inscription d'un nouvel utilisateur",
                    category: "user",
                    enabled: false
                  },
                  {
                    name: "Tentative de connexion suspecte",\
