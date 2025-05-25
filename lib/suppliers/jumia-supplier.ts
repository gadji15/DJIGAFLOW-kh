import { BaseSupplier, type SupplierProduct } from "./base-supplier"

export class JumiaSupplier extends BaseSupplier {
  async fetchProducts(page = 1, limit = 100): Promise<SupplierProduct[]> {
    try {
      // Simulation d'API Jumia (remplacer par vraie API)
      const response = await fetch(`${this.config.apiEndpoint}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          limit,
          country: "CI", // Côte d'Ivoire par défaut
        }),
      })

      if (!response.ok) {
        throw new Error(`Jumia API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.products.map((item: any) => ({
        externalId: item.sku,
        name: item.name,
        description: item.description || "",
        originalPrice: Number.parseFloat(item.price),
        currency: "XOF", // Franc CFA
        images: item.images || [],
        category: item.category || "General",
        subcategory: item.subcategory,
        brand: item.brand || "Generic",
        specifications: item.attributes || {},
        variants: item.variants || {},
        stockQuantity: item.quantity || 0,
        shippingInfo: {
          freeShipping: item.free_delivery || false,
          shippingTime: "2-5 days",
          shippingCost: item.delivery_fee || 0,
        },
        rating: Number.parseFloat(item.rating) || 0,
        reviewsCount: Number.parseInt(item.review_count) || 0,
      }))
    } catch (error) {
      console.error("Error fetching Jumia products:", error)
      return []
    }
  }

  async fetchProductDetails(externalId: string): Promise<SupplierProduct | null> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/products/${externalId}`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        return null
      }

      const item = await response.json()

      return {
        externalId: item.sku,
        name: item.name,
        description: item.description || "",
        originalPrice: Number.parseFloat(item.price),
        currency: "XOF",
        images: item.images || [],
        category: item.category || "General",
        subcategory: item.subcategory,
        brand: item.brand || "Generic",
        specifications: item.attributes || {},
        variants: item.variants || {},
        stockQuantity: item.quantity || 0,
        shippingInfo: {
          freeShipping: item.free_delivery || false,
          shippingTime: "2-5 days",
          shippingCost: item.delivery_fee || 0,
        },
        rating: Number.parseFloat(item.rating) || 0,
        reviewsCount: Number.parseInt(item.review_count) || 0,
      }
    } catch (error) {
      console.error("Error fetching Jumia product details:", error)
      return null
    }
  }

  async checkStock(externalId: string): Promise<number> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/products/${externalId}/stock`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      })

      if (!response.ok) {
        return 0
      }

      const data = await response.json()
      return data.quantity || 0
    } catch (error) {
      console.error("Error checking Jumia stock:", error)
      return 0
    }
  }

  async createOrder(orderData: any): Promise<{ success: boolean; externalOrderId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderData.items.map((item: any) => ({
            sku: item.externalId,
            quantity: item.quantity,
            variant: item.variant,
          })),
          delivery_address: orderData.shippingAddress,
          customer: orderData.customerInfo,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const data = await response.json()
      return {
        success: true,
        externalOrderId: data.order_number,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async trackOrder(externalOrderId: string): Promise<{ status: string; trackingNumber?: string }> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/orders/${externalOrderId}/status`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      })

      if (!response.ok) {
        return { status: "unknown" }
      }

      const data = await response.json()
      return {
        status: data.status || "unknown",
        trackingNumber: data.tracking_code,
      }
    } catch (error) {
      console.error("Error tracking Jumia order:", error)
      return { status: "unknown" }
    }
  }
}
