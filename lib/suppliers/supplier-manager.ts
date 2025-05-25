import { supabaseAdmin } from "@/lib/supabase"
import { AliExpressSupplier } from "./aliexpress-supplier"
import { JumiaSupplier } from "./jumia-supplier"
import type { BaseSupplier, SupplierConfig, SupplierProduct, SyncResult } from "./base-supplier"

export class SupplierManager {
  private suppliers: Map<string, BaseSupplier> = new Map()

  constructor() {
    this.initializeSuppliers()
  }

  private async initializeSuppliers() {
    try {
      const { data: suppliersData } = await supabaseAdmin.from("suppliers").select("*").eq("status", "active")

      for (const supplierData of suppliersData || []) {
        const supplier = this.createSupplierInstance(supplierData)
        if (supplier) {
          this.suppliers.set(supplierData.id, supplier)
        }
      }
    } catch (error) {
      console.error("Error initializing suppliers:", error)
    }
  }

  private createSupplierInstance(config: any): BaseSupplier | null {
    const supplierConfig: SupplierConfig = {
      id: config.id,
      name: config.name,
      type: config.type,
      apiEndpoint: config.api_endpoint,
      apiKey: config.api_key,
      apiSecret: config.api_secret,
      commissionRate: config.commission_rate,
      settings: config.settings || {},
    }

    switch (config.type) {
      case "aliexpress":
        return new AliExpressSupplier(supplierConfig)
      case "jumia":
        return new JumiaSupplier(supplierConfig)
      default:
        console.warn(`Unknown supplier type: ${config.type}`)
        return null
    }
  }

  async syncAllSuppliers(): Promise<SyncResult[]> {
    const results: SyncResult[] = []

    for (const [supplierId, supplier] of this.suppliers) {
      try {
        const result = await this.syncSupplier(supplierId)
        results.push(result)
      } catch (error) {
        console.error(`Error syncing supplier ${supplierId}:`, error)
        results.push({
          success: false,
          productsImported: 0,
          productsUpdated: 0,
          errors: [error instanceof Error ? error.message : "Unknown error"],
          duration: 0,
        })
      }
    }

    return results
  }

  async syncSupplier(supplierId: string): Promise<SyncResult> {
    const startTime = Date.now()
    const supplier = this.suppliers.get(supplierId)

    if (!supplier) {
      throw new Error(`Supplier ${supplierId} not found`)
    }

    let productsImported = 0
    let productsUpdated = 0
    const errors: string[] = []

    try {
      // Récupérer les produits du fournisseur
      const supplierProducts = await supplier.fetchProducts()

      for (const product of supplierProducts) {
        try {
          if (!supplier.validateProduct(product)) {
            errors.push(`Invalid product data for ${product.externalId}`)
            continue
          }

          // Vérifier si le produit existe déjà
          const { data: existingProduct } = await supabaseAdmin
            .from("supplier_products")
            .select("id")
            .eq("supplier_id", supplierId)
            .eq("external_id", product.externalId)
            .single()

          if (existingProduct) {
            // Mettre à jour le produit existant
            await this.updateSupplierProduct(supplierId, product)
            productsUpdated++
          } else {
            // Créer un nouveau produit
            await this.createSupplierProduct(supplierId, product)
            productsImported++
          }
        } catch (error) {
          errors.push(`Error processing product ${product.externalId}: ${error}`)
        }
      }

      // Enregistrer le log de synchronisation
      await supabaseAdmin.from("sync_logs").insert({
        supplier_id: supplierId,
        sync_type: "products",
        status: errors.length === 0 ? "success" : "partial",
        products_synced: productsImported + productsUpdated,
        errors_count: errors.length,
        duration_ms: Date.now() - startTime,
        error_details: { errors },
        summary: {
          imported: productsImported,
          updated: productsUpdated,
          total_processed: supplierProducts.length,
        },
      })

      // Mettre à jour la date de dernière synchronisation
      await supabaseAdmin.from("suppliers").update({ last_sync: new Date().toISOString() }).eq("id", supplierId)

      return {
        success: errors.length === 0,
        productsImported,
        productsUpdated,
        errors,
        duration: Date.now() - startTime,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      await supabaseAdmin.from("sync_logs").insert({
        supplier_id: supplierId,
        sync_type: "products",
        status: "error",
        products_synced: 0,
        errors_count: 1,
        duration_ms: Date.now() - startTime,
        error_details: { errors: [errorMessage] },
      })

      throw error
    }
  }

  private async createSupplierProduct(supplierId: string, product: SupplierProduct) {
    // Insérer le produit fournisseur
    const { data: supplierProduct } = await supabaseAdmin
      .from("supplier_products")
      .insert({
        supplier_id: supplierId,
        external_id: product.externalId,
        name: product.name,
        description: product.description,
        original_price: product.originalPrice,
        currency: product.currency,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        specifications: product.specifications,
        variants: product.variants,
        stock_quantity: product.stockQuantity,
        shipping_info: product.shippingInfo,
        rating: product.rating,
        reviews_count: product.reviewsCount,
      })
      .select()
      .single()

    if (supplierProduct) {
      // Créer le produit dans notre catalogue avec marge automatique
      await this.createCatalogProduct(supplierProduct.id, product)
    }
  }

  private async updateSupplierProduct(supplierId: string, product: SupplierProduct) {
    await supabaseAdmin
      .from("supplier_products")
      .update({
        name: product.name,
        description: product.description,
        original_price: product.originalPrice,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        specifications: product.specifications,
        variants: product.variants,
        stock_quantity: product.stockQuantity,
        shipping_info: product.shippingInfo,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        last_updated: new Date().toISOString(),
      })
      .eq("supplier_id", supplierId)
      .eq("external_id", product.externalId)
  }

  private async createCatalogProduct(supplierProductId: string, product: SupplierProduct) {
    // Récupérer les règles de pricing
    const { data: pricingRules } = await supabaseAdmin
      .from("pricing_rules")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true })

    let markupPercentage = 50 // Marge par défaut de 50%

    // Appliquer la première règle qui correspond
    for (const rule of pricingRules || []) {
      if (this.matchesPricingRule(rule, product)) {
        markupPercentage = rule.markup_value
        break
      }
    }

    // Récupérer ou créer la catégorie
    const { data: category } = await supabaseAdmin.from("categories").select("id").eq("name", product.category).single()

    let categoryId = category?.id

    if (!categoryId) {
      const { data: newCategory } = await supabaseAdmin
        .from("categories")
        .insert({
          name: product.category,
          description: `Catégorie ${product.category}`,
        })
        .select()
        .single()

      categoryId = newCategory?.id
    }

    // Créer le produit dans notre catalogue
    await supabaseAdmin.from("products").insert({
      name: product.name,
      description: product.description,
      price: product.originalPrice * (1 + markupPercentage / 100),
      stock: product.stockQuantity,
      category_id: categoryId,
      images: product.images,
      featured: false,
      rating: product.rating,
      reviews_count: product.reviewsCount,
      specifications: product.specifications,
      variants: product.variants,
      supplier_product_id: supplierProductId,
      markup_percentage: markupPercentage,
      auto_sync: true,
    })
  }

  private matchesPricingRule(rule: any, product: SupplierProduct): boolean {
    // Vérifier la catégorie
    if (rule.category && rule.category !== product.category) {
      return false
    }

    // Vérifier la plage de prix
    if (rule.min_price && product.originalPrice < rule.min_price) {
      return false
    }

    if (rule.max_price && product.originalPrice > rule.max_price) {
      return false
    }

    return true
  }

  async createSupplierOrder(orderId: string): Promise<boolean> {
    try {
      // Récupérer les détails de la commande
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              supplier_product_id,
              supplier_products (
                supplier_id,
                external_id
              )
            )
          )
        `)
        .eq("id", orderId)
        .single()

      if (!order) {
        throw new Error("Order not found")
      }

      // Grouper les articles par fournisseur
      const supplierGroups = new Map<string, any[]>()

      for (const item of order.order_items) {
        const supplierProductId = item.products.supplier_product_id
        if (!supplierProductId) continue

        const supplierId = item.products.supplier_products.supplier_id

        if (!supplierGroups.has(supplierId)) {
          supplierGroups.set(supplierId, [])
        }

        supplierGroups.get(supplierId)!.push({
          externalId: item.products.supplier_products.external_id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
        })
      }

      // Créer les commandes chez chaque fournisseur
      for (const [supplierId, items] of supplierGroups) {
        const supplier = this.suppliers.get(supplierId)
        if (!supplier) continue

        const orderData = {
          items,
          shippingAddress: order.shipping_address,
          customerInfo: {
            email: order.user_id, // À adapter selon votre structure
          },
        }

        const result = await supplier.createOrder(orderData)

        if (result.success) {
          // Enregistrer la commande fournisseur
          const supplierTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const ourProfit = supplierTotal * 0.2 // 20% de commission par exemple

          await supabaseAdmin.from("supplier_orders").insert({
            order_id: orderId,
            supplier_id: supplierId,
            external_order_id: result.externalOrderId,
            status: "pending",
            total_amount: supplierTotal,
            supplier_amount: supplierTotal - ourProfit,
            our_profit: ourProfit,
          })
        }
      }

      return true
    } catch (error) {
      console.error("Error creating supplier orders:", error)
      return false
    }
  }
}

// Instance singleton
export const supplierManager = new SupplierManager()
