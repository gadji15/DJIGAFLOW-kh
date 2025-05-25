import { type NextRequest, NextResponse } from "next/server"
import { supplierManager } from "@/lib/suppliers/supplier-manager"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    // Traiter la commande chez les fournisseurs
    const success = await supplierManager.createSupplierOrder(orderId)

    if (success) {
      // Mettre à jour le statut de la commande
      await supabaseAdmin
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
        })
        .eq("id", orderId)

      return NextResponse.json({
        success: true,
        message: "Order processed successfully",
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to process order with suppliers" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
