import { NextResponse } from "next/server"
import { orderProcessor } from "@/lib/order-processor"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Starting automatic order processing...")

    // Récupérer les commandes en attente de traitement
    const { data: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("status", "pending")
      .eq("payment_status", "paid")

    let processedCount = 0
    let errorCount = 0

    for (const order of pendingOrders || []) {
      const success = await orderProcessor.processNewOrder(order.id)
      if (success) {
        processedCount++
      } else {
        errorCount++
      }
    }

    // Traquer les commandes fournisseurs
    await orderProcessor.trackSupplierOrders()

    const summary = {
      timestamp: new Date().toISOString(),
      ordersProcessed: processedCount,
      errors: errorCount,
      totalPending: pendingOrders?.length || 0,
    }

    console.log("Order processing completed:", summary)

    return NextResponse.json({
      success: true,
      message: "Automatic order processing completed",
      summary,
    })
  } catch (error) {
    console.error("Error in automatic order processing:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
