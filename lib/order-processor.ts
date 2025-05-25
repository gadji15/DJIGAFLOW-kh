import { supabaseAdmin } from "@/lib/supabase"
import { supplierManager } from "@/lib/suppliers/supplier-manager"

export class OrderProcessor {
  async processNewOrder(orderId: string) {
    try {
      console.log(`Processing order ${orderId}...`)

      // 1. Vérifier le paiement (simulation)
      const paymentVerified = await this.verifyPayment(orderId)

      if (!paymentVerified) {
        throw new Error("Payment verification failed")
      }

      // 2. Créer les commandes chez les fournisseurs
      const supplierOrdersCreated = await supplierManager.createSupplierOrder(orderId)

      if (!supplierOrdersCreated) {
        throw new Error("Failed to create supplier orders")
      }

      // 3. Mettre à jour le statut de la commande
      await supabaseAdmin
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
        })
        .eq("id", orderId)

      // 4. Envoyer l'email de confirmation
      await this.sendOrderConfirmation(orderId)

      // 5. Mettre à jour les stocks
      await this.updateStockLevels(orderId)

      console.log(`Order ${orderId} processed successfully`)
      return true
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error)

      // Marquer la commande comme ayant une erreur
      await supabaseAdmin
        .from("orders")
        .update({
          status: "error",
          notes: error instanceof Error ? error.message : "Processing error",
        })
        .eq("id", orderId)

      return false
    }
  }

  private async verifyPayment(orderId: string): Promise<boolean> {
    // Simulation de vérification de paiement
    // En production, intégrer avec Stripe, PayPal, etc.

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("payment_method, total")
      .eq("id", orderId)
      .single()

    if (!order) {
      return false
    }

    // Simuler une vérification réussie
    return true
  }

  private async sendOrderConfirmation(orderId: string) {
    // Récupérer les détails de la commande
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        users (email, first_name, last_name),
        order_items (
          *,
          products (name, images)
        )
      `)
      .eq("id", orderId)
      .single()

    if (!order) {
      throw new Error("Order not found for confirmation email")
    }

    // Simulation d'envoi d'email
    console.log(`Sending confirmation email to ${order.users.email}`)
    console.log(`Order ${orderId} confirmed - Total: ${order.total}€`)

    // En production, utiliser un service d'email comme SendGrid, Resend, etc.
  }

  private async updateStockLevels(orderId: string) {
    // Récupérer les articles de la commande
    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId)

    if (!orderItems) {
      return
    }

    // Mettre à jour les stocks (pour les produits non-dropshipping)
    for (const item of orderItems) {
      await supabaseAdmin.rpc("update_product_stock", {
        product_id: item.product_id,
        quantity_sold: item.quantity,
      })
    }
  }

  async trackSupplierOrders() {
    try {
      // Récupérer toutes les commandes fournisseurs en cours
      const { data: supplierOrders } = await supabaseAdmin
        .from("supplier_orders")
        .select(`
          *,
          suppliers (id, type, name)
        `)
        .in("status", ["pending", "processing", "shipped"])

      for (const supplierOrder of supplierOrders || []) {
        const supplier = supplierManager.suppliers?.get(supplierOrder.supplier_id)

        if (supplier && supplierOrder.external_order_id) {
          const trackingInfo = await supplier.trackOrder(supplierOrder.external_order_id)

          // Mettre à jour le statut si changé
          if (trackingInfo.status !== supplierOrder.status) {
            await supabaseAdmin
              .from("supplier_orders")
              .update({
                status: trackingInfo.status,
                tracking_number: trackingInfo.trackingNumber,
                shipping_status: trackingInfo.status,
              })
              .eq("id", supplierOrder.id)

            // Si livré, mettre à jour la commande principale
            if (trackingInfo.status === "delivered") {
              await this.checkOrderCompletion(supplierOrder.order_id)
            }
          }
        }
      }

      console.log("Supplier orders tracking completed")
    } catch (error) {
      console.error("Error tracking supplier orders:", error)
    }
  }

  private async checkOrderCompletion(orderId: string) {
    // Vérifier si toutes les commandes fournisseurs sont livrées
    const { data: supplierOrders } = await supabaseAdmin
      .from("supplier_orders")
      .select("status")
      .eq("order_id", orderId)

    const allDelivered = supplierOrders?.every((order) => order.status === "delivered")

    if (allDelivered) {
      await supabaseAdmin.from("orders").update({ status: "delivered" }).eq("id", orderId)

      console.log(`Order ${orderId} marked as delivered`)
    }
  }
}

export const orderProcessor = new OrderProcessor()
