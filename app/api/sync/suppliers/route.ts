import { NextResponse } from "next/server"
import { supplierManager } from "@/lib/suppliers/supplier-manager"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Starting global supplier sync...")

    const results = await supplierManager.syncAllSuppliers()

    const summary = {
      totalSuppliers: results.length,
      successfulSyncs: results.filter((r) => r.success).length,
      totalProductsImported: results.reduce((sum, r) => sum + r.productsImported, 0),
      totalProductsUpdated: results.reduce((sum, r) => sum + r.productsUpdated, 0),
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    }

    console.log("Global sync completed:", summary)

    return NextResponse.json({
      success: true,
      summary,
      details: results,
    })
  } catch (error) {
    console.error("Error syncing suppliers:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Retourner le statut des dernières synchronisations
    const { data: syncLogs } = await supabaseAdmin
      .from("sync_logs")
      .select(`
        *,
        suppliers (name, type)
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      recentSyncs: syncLogs || [],
    })
  } catch (error) {
    console.error("Error fetching sync logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
