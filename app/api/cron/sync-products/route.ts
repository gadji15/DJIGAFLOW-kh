import { NextResponse } from "next/server"
import { supplierManager } from "@/lib/suppliers/supplier-manager"

export async function GET() {
  try {
    // Vérifier que c'est bien un appel de cron (en production, vérifier le header Authorization)
    const authHeader = process.env.CRON_SECRET

    console.log("Starting automatic product sync...")

    const results = await supplierManager.syncAllSuppliers()

    const summary = {
      timestamp: new Date().toISOString(),
      totalSuppliers: results.length,
      successfulSyncs: results.filter((r) => r.success).length,
      totalProductsImported: results.reduce((sum, r) => sum + r.productsImported, 0),
      totalProductsUpdated: results.reduce((sum, r) => sum + r.productsUpdated, 0),
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    }

    console.log("Sync completed:", summary)

    return NextResponse.json({
      success: true,
      message: "Automatic sync completed",
      summary,
    })
  } catch (error) {
    console.error("Error in automatic sync:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
