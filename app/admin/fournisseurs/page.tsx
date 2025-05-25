import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, RefreshCw, Settings, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

async function getSuppliers() {
  try {
    const { data: suppliers, error } = await supabaseAdmin
      .from("suppliers")
      .select(`
        *,
        sync_logs (
          created_at,
          status,
          products_imported,
          products_updated,
          errors_count,
          duration_ms
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching suppliers:", error)
      return []
    }

    return suppliers || []
  } catch (error) {
    console.error("Error in getSuppliers:", error)
    return []
  }
}

async function getSyncStats() {
  try {
    const { data: stats, error } = await supabaseAdmin
      .from("sync_logs")
      .select("status, products_imported, products_updated, errors_count")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error("Error fetching sync stats:", error)
      return { totalImported: 0, totalUpdated: 0, totalErrors: 0, successfulSyncs: 0, totalSyncs: 0 }
    }

    const totalImported = stats?.reduce((sum, log) => sum + (log.products_imported || 0), 0) || 0
    const totalUpdated = stats?.reduce((sum, log) => sum + (log.products_updated || 0), 0) || 0
    const totalErrors = stats?.reduce((sum, log) => sum + (log.errors_count || 0), 0) || 0
    const successfulSyncs = stats?.filter((log) => log.status === "success").length || 0

    return {
      totalImported,
      totalUpdated,
      totalErrors,
      successfulSyncs,
      totalSyncs: stats?.length || 0,
    }
  } catch (error) {
    console.error("Error in getSyncStats:", error)
    return { totalImported: 0, totalUpdated: 0, totalErrors: 0, successfulSyncs: 0, totalSyncs: 0 }
  }
}

function SuppliersContent() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuppliersData />
    </Suspense>
  )
}

async function SuppliersData() {
  const [suppliers, syncStats] = await Promise.all([getSuppliers(), getSyncStats()])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Fournisseurs</h1>
        <div className="flex gap-2">
          <form action="/api/sync/suppliers" method="POST">
            <Button type="submit" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchroniser tout
            </Button>
          </form>
          <Button asChild>
            <Link href="/admin/fournisseurs/ajouter">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un fournisseur
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques de synchronisation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits importés (24h)</p>
                <h3 className="text-2xl font-bold">{syncStats.totalImported}</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits mis à jour (24h)</p>
                <h3 className="text-2xl font-bold">{syncStats.totalUpdated}</h3>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Synchronisations réussies</p>
                <h3 className="text-2xl font-bold">
                  {syncStats.successfulSyncs}/{syncStats.totalSyncs}
                </h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Erreurs (24h)</p>
                <h3 className="text-2xl font-bold">{syncStats.totalErrors}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des fournisseurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => {
          const lastSync = supplier.sync_logs?.[0]
          const statusColor =
            supplier.status === "active" ? "default" : supplier.status === "inactive" ? "secondary" : "destructive"

          return (
            <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize flex items-center gap-2">
                      {supplier.type}
                      {supplier.auto_sync && <Clock className="h-3 w-3" />}
                    </p>
                  </div>
                  <Badge variant={statusColor}>{supplier.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Commission:</span>
                    <span className="font-medium">{supplier.commission_rate}%</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Devise:</span>
                    <span className="font-medium">{supplier.currency}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Sync auto:</span>
                    <Badge variant={supplier.auto_sync ? "default" : "secondary"} className="text-xs">
                      {supplier.auto_sync ? "Activée" : "Désactivée"}
                    </Badge>
                  </div>

                  {lastSync && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Dernière sync:</span>
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(lastSync.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Importés:</span>
                        <span className="font-medium text-green-600">{lastSync.products_imported || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mis à jour:</span>
                        <span className="font-medium text-blue-600">{lastSync.products_updated || 0}</span>
                      </div>
                      {lastSync.errors_count > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Erreurs:</span>
                          <span className="font-medium text-red-600">{lastSync.errors_count}</span>
                        </div>
                      )}
                      {lastSync.duration_ms && (
                        <div className="flex justify-between text-sm">
                          <span>Durée:</span>
                          <span className="font-medium">{Math.round(lastSync.duration_ms / 1000)}s</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <form action={`/api/sync/suppliers/${supplier.id}`} method="POST" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full" type="submit">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync
                      </Button>
                    </form>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/admin/fournisseurs/${supplier.id}`}>
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {suppliers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Aucun fournisseur configuré</h3>
            <p className="text-muted-foreground mb-4">
              Ajoutez votre premier fournisseur pour commencer à importer des produits automatiquement.
            </p>
            <Button asChild>
              <Link href="/admin/fournisseurs/ajouter">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un fournisseur
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SuppliersPage() {
  return <SuppliersContent />
}
