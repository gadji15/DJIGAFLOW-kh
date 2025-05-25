export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  inherits?: string[]
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  conditions?: Record<string, any>
}

export class RBACSystem {
  private permissions: Map<string, Permission> = new Map()
  private roles: Map<string, Role> = new Map()
  private userRoles: Map<string, UserRole[]> = new Map()

  constructor() {
    this.initializeSystemPermissions()
    this.initializeSystemRoles()
  }

  private initializeSystemPermissions() {
    const systemPermissions: Permission[] = [
      // Gestion des utilisateurs
      {
        id: "users.view",
        name: "Voir les utilisateurs",
        description: "Consulter la liste des utilisateurs",
        resource: "users",
        action: "read",
      },
      {
        id: "users.create",
        name: "Créer des utilisateurs",
        description: "Ajouter de nouveaux utilisateurs",
        resource: "users",
        action: "create",
      },
      {
        id: "users.edit",
        name: "Modifier les utilisateurs",
        description: "Éditer les informations utilisateur",
        resource: "users",
        action: "update",
      },
      {
        id: "users.delete",
        name: "Supprimer les utilisateurs",
        description: "Supprimer des comptes utilisateur",
        resource: "users",
        action: "delete",
      },

      // Gestion des produits
      {
        id: "products.view",
        name: "Voir les produits",
        description: "Consulter le catalogue produits",
        resource: "products",
        action: "read",
      },
      {
        id: "products.create",
        name: "Créer des produits",
        description: "Ajouter de nouveaux produits",
        resource: "products",
        action: "create",
      },
      {
        id: "products.edit",
        name: "Modifier les produits",
        description: "Éditer les informations produit",
        resource: "products",
        action: "update",
      },
      {
        id: "products.delete",
        name: "Supprimer les produits",
        description: "Supprimer des produits",
        resource: "products",
        action: "delete",
      },
      {
        id: "products.publish",
        name: "Publier les produits",
        description: "Publier/dépublier des produits",
        resource: "products",
        action: "publish",
      },

      // Gestion des commandes
      {
        id: "orders.view",
        name: "Voir les commandes",
        description: "Consulter les commandes",
        resource: "orders",
        action: "read",
      },
      {
        id: "orders.edit",
        name: "Modifier les commandes",
        description: "Éditer les commandes",
        resource: "orders",
        action: "update",
      },
      {
        id: "orders.cancel",
        name: "Annuler les commandes",
        description: "Annuler des commandes",
        resource: "orders",
        action: "cancel",
      },
      {
        id: "orders.refund",
        name: "Rembourser les commandes",
        description: "Effectuer des remboursements",
        resource: "orders",
        action: "refund",
      },

      // Gestion du contenu
      {
        id: "content.view",
        name: "Voir le contenu",
        description: "Consulter le contenu",
        resource: "content",
        action: "read",
      },
      {
        id: "content.create",
        name: "Créer du contenu",
        description: "Créer du nouveau contenu",
        resource: "content",
        action: "create",
      },
      {
        id: "content.edit",
        name: "Modifier le contenu",
        description: "Éditer le contenu existant",
        resource: "content",
        action: "update",
      },
      {
        id: "content.delete",
        name: "Supprimer le contenu",
        description: "Supprimer du contenu",
        resource: "content",
        action: "delete",
      },
      {
        id: "content.publish",
        name: "Publier le contenu",
        description: "Publier/dépublier du contenu",
        resource: "content",
        action: "publish",
      },
      {
        id: "content.approve",
        name: "Approuver le contenu",
        description: "Approuver le contenu pour publication",
        resource: "content",
        action: "approve",
      },

      // Analytics et rapports
      {
        id: "analytics.view",
        name: "Voir les analytics",
        description: "Consulter les statistiques",
        resource: "analytics",
        action: "read",
      },
      {
        id: "analytics.export",
        name: "Exporter les analytics",
        description: "Exporter les données analytiques",
        resource: "analytics",
        action: "export",
      },

      // Configuration système
      {
        id: "system.settings",
        name: "Paramètres système",
        description: "Modifier les paramètres système",
        resource: "system",
        action: "configure",
      },
      {
        id: "system.backup",
        name: "Sauvegardes système",
        description: "Gérer les sauvegardes",
        resource: "system",
        action: "backup",
      },
      {
        id: "system.logs",
        name: "Logs système",
        description: "Consulter les logs système",
        resource: "system",
        action: "logs",
      },

      // Intégrations
      {
        id: "integrations.view",
        name: "Voir les intégrations",
        description: "Consulter les intégrations",
        resource: "integrations",
        action: "read",
      },
      {
        id: "integrations.manage",
        name: "Gérer les intégrations",
        description: "Configurer les intégrations",
        resource: "integrations",
        action: "manage",
      },
    ]

    systemPermissions.forEach((permission) => {
      this.permissions.set(permission.id, permission)
    })
  }

  private initializeSystemRoles() {
    const systemRoles: Role[] = [
      {
        id: "super_admin",
        name: "Super Administrateur",
        description: "Accès complet à toutes les fonctionnalités",
        permissions: Array.from(this.permissions.values()),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "admin",
        name: "Administrateur",
        description: "Accès administratif standard",
        permissions: Array.from(this.permissions.values()).filter(
          (p) => !["system.settings", "system.backup"].includes(p.id),
        ),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "content_manager",
        name: "Gestionnaire de contenu",
        description: "Gestion du contenu et des produits",
        permissions: Array.from(this.permissions.values()).filter(
          (p) => p.resource === "content" || p.resource === "products" || p.id === "analytics.view",
        ),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "customer_service",
        name: "Service client",
        description: "Gestion des commandes et support client",
        permissions: Array.from(this.permissions.values()).filter(
          (p) => p.resource === "orders" || (p.resource === "users" && p.action === "read"),
        ),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "analyst",
        name: "Analyste",
        description: "Accès aux analytics et rapports",
        permissions: Array.from(this.permissions.values()).filter(
          (p) =>
            p.resource === "analytics" || (p.action === "read" && ["users", "products", "orders"].includes(p.resource)),
        ),
        isSystem: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    systemRoles.forEach((role) => {
      this.roles.set(role.id, role)
    })
  }

  // Vérifier si un utilisateur a une permission spécifique
  async hasPermission(userId: string, permissionId: string, context?: Record<string, any>): Promise<boolean> {
    const userRoles = this.userRoles.get(userId) || []

    for (const userRole of userRoles) {
      // Vérifier si le rôle a expiré
      if (userRole.expiresAt && userRole.expiresAt < new Date()) {
        continue
      }

      const role = this.roles.get(userRole.roleId)
      if (!role) continue

      // Vérifier les permissions du rôle
      const hasPermission = role.permissions.some((p) => p.id === permissionId)
      if (hasPermission) {
        // Vérifier les conditions contextuelles si nécessaires
        if (context && userRole.conditions) {
          return this.evaluateConditions(userRole.conditions, context)
        }
        return true
      }

      // Vérifier les rôles hérités
      if (role.inherits) {
        for (const inheritedRoleId of role.inherits) {
          const inheritedRole = this.roles.get(inheritedRoleId)
          if (inheritedRole?.permissions.some((p) => p.id === permissionId)) {
            return true
          }
        }
      }
    }

    return false
  }

  // Obtenir toutes les permissions d'un utilisateur
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoles = this.userRoles.get(userId) || []
    const permissions = new Set<Permission>()

    for (const userRole of userRoles) {
      if (userRole.expiresAt && userRole.expiresAt < new Date()) {
        continue
      }

      const role = this.roles.get(userRole.roleId)
      if (role) {
        role.permissions.forEach((p) => permissions.add(p))

        // Ajouter les permissions des rôles hérités
        if (role.inherits) {
          for (const inheritedRoleId of role.inherits) {
            const inheritedRole = this.roles.get(inheritedRoleId)
            if (inheritedRole) {
              inheritedRole.permissions.forEach((p) => permissions.add(p))
            }
          }
        }
      }
    }

    return Array.from(permissions)
  }

  // Assigner un rôle à un utilisateur
  async assignRole(userId: string, roleId: string, assignedBy: string, expiresAt?: Date): Promise<void> {
    const userRoles = this.userRoles.get(userId) || []

    // Vérifier si le rôle existe déjà
    const existingRole = userRoles.find((ur) => ur.roleId === roleId)
    if (existingRole) {
      throw new Error("L'utilisateur a déjà ce rôle")
    }

    const newUserRole: UserRole = {
      userId,
      roleId,
      assignedBy,
      assignedAt: new Date(),
      expiresAt,
    }

    userRoles.push(newUserRole)
    this.userRoles.set(userId, userRoles)
  }

  // Révoquer un rôle d'un utilisateur
  async revokeRole(userId: string, roleId: string): Promise<void> {
    const userRoles = this.userRoles.get(userId) || []
    const filteredRoles = userRoles.filter((ur) => ur.roleId !== roleId)
    this.userRoles.set(userId, filteredRoles)
  }

  // Créer un nouveau rôle personnalisé
  async createRole(role: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> {
    const newRole: Role = {
      ...role,
      id: `custom_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.roles.set(newRole.id, newRole)
    return newRole
  }

  // Évaluer les conditions contextuelles
  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false
      }
    }
    return true
  }

  // Obtenir tous les rôles
  getAllRoles(): Role[] {
    return Array.from(this.roles.values())
  }

  // Obtenir toutes les permissions
  getAllPermissions(): Permission[] {
    return Array.from(this.permissions.values())
  }
}

// Instance globale du système RBAC
export const rbacSystem = new RBACSystem()
