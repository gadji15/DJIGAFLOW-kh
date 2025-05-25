"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  Users,
  Key,
  Plus,
  Edit,
  Trash2,
  Search,
  UserCheck,
  Settings,
  Lock,
  Crown,
  AlertTriangle,
} from "lucide-react"
import { rbacSystem, type Role, type Permission } from "@/lib/rbac/rbac-system"

export default function RBACManagement() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setRoles(rbacSystem.getAllRoles())
    setPermissions(rbacSystem.getAllPermissions())
  }, [])

  const systemRoles = roles.filter((r) => r.isSystem)
  const customRoles = roles.filter((r) => !r.isSystem)

  // Grouper les permissions par ressource
  const permissionsByResource = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gestion RBAC</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Contrôle d'accès basé sur les rôles - Gérez les permissions et rôles utilisateur
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button onClick={() => setIsCreateRoleOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rôle
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rôles système</p>
                <p className="text-2xl font-bold text-blue-600">{systemRoles.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rôles personnalisés</p>
                <p className="text-2xl font-bold text-purple-600">{customRoles.length}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Permissions totales</p>
                <p className="text-2xl font-bold text-green-600">{permissions.length}</p>
              </div>
              <Key className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs assignés</p>
                <p className="text-2xl font-bold text-orange-600">247</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignments">Assignations</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Recherche */}
          <Card>
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des rôles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rôles système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rôles système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemRoles
                  .filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onEdit={() => {
                        setSelectedRole(role)
                        setIsEditRoleOpen(true)
                      }}
                      isSystem={true}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Rôles personnalisés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Rôles personnalisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customRoles.length === 0 ? (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Aucun rôle personnalisé</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Créez des rôles personnalisés pour répondre aux besoins spécifiques de votre organisation
                  </p>
                  <Button onClick={() => setIsCreateRoleOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un rôle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customRoles
                    .filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((role) => (
                      <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={() => {
                          setSelectedRole(role)
                          setIsEditRoleOpen(true)
                        }}
                        isSystem={false}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Matrice des permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(permissionsByResource).map(([resource, resourcePermissions]) => (
                  <div key={resource} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">{resource}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {resourcePermissions.map((permission) => (
                        <Card key={permission.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{permission.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{permission.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {permission.action}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Assignations de rôles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Assigné par</TableHead>
                    <TableHead>Date d'assignation</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Données d'exemple */}
                  <TableRow>
                    <TableCell>
                      <div>
                        <div className="font-medium">Jean Dupont</div>
                        <div className="text-sm text-gray-600">jean.dupont@example.com</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">Super Administrateur</Badge>
                    </TableCell>
                    <TableCell>Système</TableCell>
                    <TableCell>15/01/2024</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Journal d'audit RBAC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    timestamp: new Date("2024-01-20T14:30:00"),
                    action: "Rôle assigné",
                    details: 'Rôle "Content Manager" assigné à Marie Martin',
                    user: "admin@djigaflow.com",
                    severity: "info",
                  },
                  {
                    timestamp: new Date("2024-01-20T14:25:00"),
                    action: "Permission modifiée",
                    details: 'Permission "products.delete" ajoutée au rôle "Manager"',
                    user: "admin@djigaflow.com",
                    severity: "warning",
                  },
                  {
                    timestamp: new Date("2024-01-20T14:20:00"),
                    action: "Rôle créé",
                    details: 'Nouveau rôle personnalisé "Marketing Team" créé',
                    user: "admin@djigaflow.com",
                    severity: "info",
                  },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        entry.severity === "warning"
                          ? "bg-yellow-500"
                          : entry.severity === "error"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{entry.action}</span>
                        <span className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{entry.details}</p>
                      <p className="text-xs text-gray-500 mt-1">Par {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de création de rôle */}
      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau rôle</DialogTitle>
            <DialogDescription>Définissez un nouveau rôle avec des permissions spécifiques</DialogDescription>
          </DialogHeader>
          <RoleForm
            permissions={permissions}
            onSave={() => setIsCreateRoleOpen(false)}
            onCancel={() => setIsCreateRoleOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition de rôle */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le rôle</DialogTitle>
            <DialogDescription>Modifiez les permissions et paramètres du rôle</DialogDescription>
          </DialogHeader>
          <RoleForm
            role={selectedRole}
            permissions={permissions}
            onSave={() => {
              setIsEditRoleOpen(false)
              setSelectedRole(null)
            }}
            onCancel={() => {
              setIsEditRoleOpen(false)
              setSelectedRole(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant carte de rôle
function RoleCard({ role, onEdit, isSystem }: { role: Role; onEdit: () => void; isSystem: boolean }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="group">
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {isSystem ? <Shield className="h-5 w-5 text-blue-600" /> : <Crown className="h-5 w-5 text-purple-600" />}
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{role.name}</h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              {!isSystem && (
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{role.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Permissions</span>
              <Badge variant="outline">{role.permissions.length}</Badge>
            </div>

            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((permission) => (
                <Badge key={permission.id} variant="secondary" className="text-xs">
                  {permission.action}
                </Badge>
              ))}
              {role.permissions.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{role.permissions.length - 3}
                </Badge>
              )}
            </div>

            {isSystem && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Lock className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Rôle système protégé</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Composant formulaire de rôle
function RoleForm({
  role,
  permissions,
  onSave,
  onCancel,
}: {
  role?: Role | null
  permissions: Permission[]
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    selectedPermissions: role?.permissions.map((p) => p.id) || [],
  })

  const permissionsByResource = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(permissionId)
        ? prev.selectedPermissions.filter((id) => id !== permissionId)
        : [...prev.selectedPermissions, permissionId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous ajouteriez la logique de sauvegarde
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du rôle *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Permissions</h3>

        {Object.entries(permissionsByResource).map(([resource, resourcePermissions]) => (
          <Card key={resource}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize">{resource}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resourcePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={formData.selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{role ? "Mettre à jour" : "Créer"}</Button>
      </DialogFooter>
    </form>
  )
}
