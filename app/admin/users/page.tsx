"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Crown,
  Star,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "manager" | "customer" | "vip"
  status: "active" | "inactive"
  emailVerified: boolean
  phone?: string
  location?: string
  joinedAt: Date
  lastLogin?: Date
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  permissions: string[]
  notes?: string
  tags: string[]
}

interface UserGroup {
  id: string
  name: string
  description: string
  userCount: number
  permissions: string[]
  color: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    status: "active",
    emailVerified: true,
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    joinedAt: new Date("2023-01-15"),
    lastLogin: new Date("2024-01-20T14:30:00"),
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    permissions: ["all"],
    tags: ["admin", "founder"],
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "vip",
    status: "active",
    emailVerified: true,
    phone: "+33 6 78 90 12 34",
    location: "Lyon, France",
    joinedAt: new Date("2023-03-20"),
    lastLogin: new Date("2024-01-20T12:15:00"),
    totalOrders: 47,
    totalSpent: 12450,
    loyaltyPoints: 2490,
    permissions: ["view_products", "place_orders"],
    tags: ["vip", "loyal_customer"],
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    role: "customer",
    status: "active",
    emailVerified: false,
    location: "Marseille, France",
    joinedAt: new Date("2023-12-10"),
    lastLogin: new Date("2024-01-19T16:45:00"),
    totalOrders: 3,
    totalSpent: 289,
    loyaltyPoints: 58,
    permissions: ["view_products", "place_orders"],
    tags: ["new_customer"],
  },
  {
    id: "4",
    name: "Sophie Leroy",
    email: "sophie.leroy@example.com",
    role: "manager",
    status: "active",
    emailVerified: true,
    phone: "+33 7 89 01 23 45",
    location: "Toulouse, France",
    joinedAt: new Date("2023-06-01"),
    lastLogin: new Date("2024-01-20T09:30:00"),
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    permissions: ["manage_products", "view_orders", "manage_customers"],
    tags: ["manager", "products_expert"],
  },
  {
    id: "5",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    role: "customer",
    status: "inactive",
    emailVerified: true,
    location: "Nice, France",
    joinedAt: new Date("2023-08-15"),
    lastLogin: new Date("2023-12-20T14:20:00"),
    totalOrders: 1,
    totalSpent: 45,
    loyaltyPoints: 9,
    permissions: ["view_products"],
    tags: ["inactive"],
    notes: "Client inactif depuis 1 mois",
  },
]

const mockGroups: UserGroup[] = [
  {
    id: "1",
    name: "Administrateurs",
    description: "Accès complet à toutes les fonctionnalités",
    userCount: 2,
    permissions: ["all"],
    color: "bg-red-100 text-red-800",
  },
  {
    id: "2",
    name: "Managers",
    description: "Gestion des produits et commandes",
    userCount: 3,
    permissions: ["manage_products", "view_orders", "manage_customers"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "3",
    name: "Clients VIP",
    description: "Clients privilégiés avec avantages spéciaux",
    userCount: 12,
    permissions: ["view_products", "place_orders", "priority_support"],
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "4",
    name: "Clients Standard",
    description: "Clients réguliers",
    userCount: 1247,
    permissions: ["view_products", "place_orders"],
    color: "bg-green-100 text-green-800",
  },
]

const roleColors = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  vip: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  customer: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
}

const roleIcons = {
  admin: Crown,
  manager: Shield,
  vip: Star,
  customer: Users,
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [groups, setGroups] = useState<UserGroup[]>(mockGroups)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Statistiques
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const vipUsers = users.filter((u) => u.role === "vip").length
  const newUsersThisMonth = users.filter((u) => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    return u.joinedAt > monthAgo
  }).length

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesStatus = filterStatus === "all" || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const updateUserStatus = (userId: string, status: User["status"]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status } : user)))
  }

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion des utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les comptes, permissions et groupes d'utilisateurs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clients VIP</p>
                <p className="text-2xl font-bold text-purple-600">{vipUsers}</p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nouveaux ce mois</p>
                <p className="text-2xl font-bold text-orange-600">{newUsersThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher des utilisateurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="customer">Client</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-800">
                    <tr className="text-left">
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Utilisateur</th>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Rôle</th>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Statut</th>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Dernière connexion</th>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Commandes</th>
                      <th className="p-4 font-medium text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredUsers.map((user) => {
                        const RoleIcon = roleIcons[user.role]
                        return (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                                  {!user.emailVerified && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      Email non vérifié
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <RoleIcon className="h-4 w-4" />
                                <Badge className={roleColors[user.role]}>{user.role}</Badge>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={statusColors[user.status]}>
                                {user.status === "active" ? "Actif" : "Inactif"}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                              {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Jamais"}
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="font-medium">{user.totalOrders} commandes</div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {user.totalSpent.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Voir le profil
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Envoyer un email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {user.status === "active" ? (
                                    <DropdownMenuItem onClick={() => updateUserStatus(user.id, "inactive")}>
                                      <Ban className="h-4 w-4 mr-2" />
                                      Désactiver
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => updateUserStatus(user.id, "active")}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Activer
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{group.description}</p>
                    </div>
                    <Badge className={group.color}>{group.userCount} utilisateurs</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {group.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {group.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{group.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      Membres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matrice des permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Permission</th>
                      <th className="text-center p-4">Admin</th>
                      <th className="text-center p-4">Manager</th>
                      <th className="text-center p-4">VIP</th>
                      <th className="text-center p-4">Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Voir les produits", admin: true, manager: true, vip: true, customer: true },
                      { name: "Gérer les produits", admin: true, manager: true, vip: false, customer: false },
                      { name: "Voir les commandes", admin: true, manager: true, vip: false, customer: false },
                      { name: "Passer des commandes", admin: true, manager: false, vip: true, customer: true },
                      { name: "Gérer les utilisateurs", admin: true, manager: false, vip: false, customer: false },
                      { name: "Accès aux statistiques", admin: true, manager: true, vip: false, customer: false },
                      { name: "Support prioritaire", admin: true, manager: true, vip: true, customer: false },
                      { name: "Remises spéciales", admin: true, manager: false, vip: true, customer: false },
                    ].map((permission, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="p-4 font-medium">{permission.name}</td>
                        <td className="p-4 text-center">
                          {permission.admin ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {permission.manager ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {permission.vip ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {permission.customer ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de création d'utilisateur */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            <DialogDescription>Ajoutez un nouvel utilisateur à votre plateforme</DialogDescription>
          </DialogHeader>
          <UserForm onSave={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition d'utilisateur */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur</DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            onSave={() => {
              setIsEditDialogOpen(false)
              setSelectedUser(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant de formulaire utilisateur
function UserForm({ user, onSave }: { user?: User | null; onSave: () => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "customer",
    phone: user?.phone || "",
    location: user?.location || "",
    notes: user?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous ajouteriez la logique de sauvegarde
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Client</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onSave}>
          Annuler
        </Button>
        <Button type="submit">{user ? "Mettre à jour" : "Créer"}</Button>
      </DialogFooter>
    </form>
  )
}
