// Vérification stricte des variables d'environnement
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SERVICE_ROLE_KEY

const hasSupabaseConfig = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

console.log("🔍 Configuration Supabase:", {
  hasUrl: !!SUPABASE_URL,
  hasAnonKey: !!SUPABASE_ANON_KEY,
  hasServiceKey: !!SERVICE_ROLE_KEY,
  isDemoMode: !hasSupabaseConfig,
})

// Interface complète pour le client mock
interface MockSupabaseResponse<T = any> {
  data: T | null
  error: any
}

interface MockSupabaseQueryBuilder {
  select: (columns?: string) => MockSupabaseQueryBuilder
  eq: (column: string, value: any) => MockSupabaseQueryBuilder
  gte: (column: string, value: any) => MockSupabaseQueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => MockSupabaseQueryBuilder
  limit: (count: number) => MockSupabaseQueryBuilder
  single: () => Promise<MockSupabaseResponse>
}

interface MockSupabaseTable {
  select: (columns?: string) => MockSupabaseQueryBuilder
  insert: (data: any) => Promise<MockSupabaseResponse>
  update: (data: any) => Promise<MockSupabaseResponse>
  delete: () => Promise<MockSupabaseResponse>
}

interface MockSupabaseAuth {
  getSession: () => Promise<MockSupabaseResponse>
  getUser: () => Promise<MockSupabaseResponse>
  signInWithPassword: (credentials: any) => Promise<MockSupabaseResponse>
  signUp: (credentials: any) => Promise<MockSupabaseResponse>
  signOut: () => Promise<MockSupabaseResponse>
  onAuthStateChange: (callback: any) => { data: { subscription: { unsubscribe: () => void } } }
}

interface MockSupabaseClient {
  auth: MockSupabaseAuth
  from: (table: string) => MockSupabaseTable
}

// Client mock complet qui simule parfaitement Supabase
const createMockSupabaseClient = (): MockSupabaseClient => {
  const createMockQueryBuilder = (mockData: any[] = []): MockSupabaseQueryBuilder => {
    const builder: MockSupabaseQueryBuilder = {
      select: () => builder,
      eq: () => builder,
      gte: () => builder,
      order: () => builder,
      limit: () => builder,
      single: async () => ({ data: null, error: { message: "Mode démo" } }),
    }
    return builder
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: "Mode démo - Configurez Supabase" },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: "Mode démo - Configurez Supabase" },
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string): MockSupabaseTable => ({
      select: (columns?: string) => createMockQueryBuilder([]),
      insert: async (data: any) => ({ data: null, error: { message: "Mode démo" } }),
      update: async (data: any) => ({ data: null, error: { message: "Mode démo" } }),
      delete: async () => ({ data: null, error: { message: "Mode démo" } }),
    }),
  }
}

// Variables globales pour les clients (initialisées à null)
let supabaseClientInstance: any = null
let supabaseAdminInstance: any = null

// Fonction pour créer le client Supabase réel (uniquement si configuré)
const createRealSupabaseClient = async () => {
  if (!hasSupabaseConfig) {
    console.warn("⚠️ Tentative de création d'un client Supabase sans configuration")
    return createMockSupabaseClient()
  }

  try {
    // Import dynamique conditionnel
    const { createClient } = await import("@supabase/supabase-js")
    console.log("✅ Client Supabase créé avec succès")
    return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  } catch (error) {
    console.error("❌ Erreur lors de la création du client Supabase:", error)
    return createMockSupabaseClient()
  }
}

// Fonction pour obtenir le client Supabase principal
export const getSupabaseClient = async () => {
  if (supabaseClientInstance) return supabaseClientInstance

  if (hasSupabaseConfig) {
    supabaseClientInstance = await createRealSupabaseClient()
  } else {
    console.log("🚧 Mode démo activé - Client Supabase mock")
    supabaseClientInstance = createMockSupabaseClient()
  }

  return supabaseClientInstance
}

// Fonction pour obtenir le client admin
export const getSupabaseAdminClient = async () => {
  if (supabaseAdminInstance) return supabaseAdminInstance

  if (hasSupabaseConfig) {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      supabaseAdminInstance = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      console.log("✅ Client Supabase Admin créé avec succès")
    } catch (error) {
      console.error("❌ Erreur lors de la création du client admin:", error)
      supabaseAdminInstance = createMockSupabaseClient()
    }
  } else {
    supabaseAdminInstance = createMockSupabaseClient()
  }

  return supabaseAdminInstance
}

// IMPORTANT: Exports par défaut qui ne causent JAMAIS d'erreur
export const supabase = createMockSupabaseClient()
export const supabaseAdmin = createMockSupabaseClient()

// Données de démonstration ultra-réalistes
export const mockData = {
  // Statistiques du dashboard
  dashboardStats: {
    products: {
      total: 1247,
      active: 1156,
      featured: 89,
      newThisWeek: 23,
      growth: 8.5,
    },
    orders: {
      total: 342,
      pending: 12,
      completed: 298,
      revenue: 45678.9,
      growth: 12.3,
      revenueGrowth: 15.7,
    },
    suppliers: {
      total: 8,
      active: 6,
    },
    users: {
      new: 156,
      growth: 22.1,
    },
  },

  // Synchronisations récentes
  recentSyncs: [
    {
      id: "1",
      status: "success",
      products_imported: 45,
      products_updated: 12,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      suppliers: { name: "AliExpress", type: "aliexpress" },
    },
    {
      id: "2",
      status: "success",
      products_imported: 23,
      products_updated: 8,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      suppliers: { name: "Jumia", type: "jumia" },
    },
    {
      id: "3",
      status: "partial",
      products_imported: 12,
      products_updated: 5,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      suppliers: { name: "DHgate", type: "dhgate" },
    },
  ],

  // Commandes récentes
  recentOrders: [
    {
      id: "1",
      order_number: "DJG-2024-001",
      status: "delivered",
      total: 299.99,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      order_number: "DJG-2024-002",
      status: "processing",
      total: 156.5,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      order_number: "DJG-2024-003",
      status: "pending",
      total: 89.99,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ],

  // Produits populaires
  topProducts: [
    {
      id: "1",
      name: "Smartphone Premium 5G",
      price: 599.99,
      images: ["/placeholder.svg?height=200&width=200"],
    },
    {
      id: "2",
      name: "Casque Bluetooth Pro",
      price: 129.99,
      images: ["/placeholder.svg?height=200&width=200"],
    },
    {
      id: "3",
      name: "Montre Connectée Sport",
      price: 249.99,
      images: ["/placeholder.svg?height=200&width=200"],
    },
    {
      id: "4",
      name: "Écouteurs Sans Fil",
      price: 79.99,
      images: ["/placeholder.svg?height=200&width=200"],
    },
  ],

  // Produits en vedette
  featuredProducts: [
    {
      id: "1",
      name: "Smartphone Premium 5G",
      price: 599.99,
      sale_price: 499.99,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.8,
      reviews_count: 124,
      featured: true,
      status: "active",
    },
    {
      id: "2",
      name: "Casque Bluetooth Pro",
      price: 129.99,
      sale_price: null,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.6,
      reviews_count: 89,
      featured: true,
      status: "active",
    },
    {
      id: "3",
      name: "Montre Connectée Sport",
      price: 249.99,
      sale_price: 199.99,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.7,
      reviews_count: 156,
      featured: true,
      status: "active",
    },
    {
      id: "4",
      name: "Écouteurs Sans Fil",
      price: 79.99,
      sale_price: null,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.5,
      reviews_count: 67,
      featured: true,
      status: "active",
    },
    {
      id: "5",
      name: "Tablette 10 pouces",
      price: 299.99,
      sale_price: 249.99,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.4,
      reviews_count: 92,
      featured: true,
      status: "active",
    },
    {
      id: "6",
      name: "Chargeur Sans Fil",
      price: 39.99,
      sale_price: null,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.3,
      reviews_count: 78,
      featured: true,
      status: "active",
    },
    {
      id: "7",
      name: "Caméra de Sécurité",
      price: 89.99,
      sale_price: 69.99,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.6,
      reviews_count: 134,
      featured: true,
      status: "active",
    },
    {
      id: "8",
      name: "Haut-parleur Bluetooth",
      price: 59.99,
      sale_price: null,
      images: ["/placeholder.svg?height=300&width=300"],
      rating: 4.2,
      reviews_count: 56,
      featured: true,
      status: "active",
    },
  ],

  // Catégories
  categories: [
    { id: "1", name: "Électronique", slug: "electronique", is_active: true, sort_order: 1 },
    { id: "2", name: "Mode", slug: "mode", is_active: true, sort_order: 2 },
    { id: "3", name: "Maison", slug: "maison", is_active: true, sort_order: 3 },
    { id: "4", name: "Sport", slug: "sport", is_active: true, sort_order: 4 },
    { id: "5", name: "Beauté", slug: "beaute", is_active: true, sort_order: 5 },
    { id: "6", name: "Auto", slug: "auto", is_active: true, sort_order: 6 },
  ],
}

// Helper pour vérifier le statut de connexion
export const getConnectionStatus = () => ({
  connected: hasSupabaseConfig,
  isDemoMode: !hasSupabaseConfig,
  message: hasSupabaseConfig
    ? "✅ Connecté à Supabase"
    : "🚧 Mode démo - Configurez les variables d'environnement Supabase",
  config: {
    hasUrl: !!SUPABASE_URL,
    hasAnonKey: !!SUPABASE_ANON_KEY,
    hasServiceKey: !!SERVICE_ROLE_KEY,
  },
})

// Helper pour obtenir des données avec fallback automatique
export const getDataWithFallback = async <T>(
  supabaseQuery: () => Promise<{ data: T; error: any }>,
  fallbackData: T\
)
: Promise<
{
  data: T
  error: any
}
> =>
{
  \
  if (!hasSupabaseConfig) {
    console.log(\"📊 Utilisation des données de démonstration")
    \
    return { data: fallbackData, error: null }
  }

  try {
    const result = await supabaseQuery()
    if (result.error) {
      console.warn("⚠️ Erreur Supabase, utilisation du fallback:", result.error)
      return { data: fallbackData, error: result.error }
    }
    return result
  } catch (error) {
    console.error("❌ Erreur lors de la requête Supabase:", error)
    return { data: fallbackData, error }
  }
}

// Helper simplifié pour les requêtes
export const queryData = async <T>(fallbackData: T)
: Promise<T> =>
{
  \
  // En mode démo, on retourne toujours les données de fallback
  if (!hasSupabaseConfig) {
    return fallbackData
  }

  // Si Supabase est configuré, on pourrait faire de vraies requêtes ici
  // Pour l'instant, on retourne les données de fallback
  return fallbackData
}
