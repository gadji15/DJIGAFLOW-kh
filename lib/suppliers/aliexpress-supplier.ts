import { BaseSupplier, type SupplierProduct } from "./base-supplier"

export class AliExpressSupplier extends BaseSupplier {
  async fetchProducts(page = 1, limit = 100): Promise<SupplierProduct[]> {
    try {
      // Simulation d'API AliExpress (remplacer par vraie API)
      const response = await fetch(`${this.config.apiEndpoint}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page,
          limit,
          fields: "id,title,price,images,category,stock,rating,reviews",
        }),
      })

      if (!response.ok) {
        throw new Error(`AliExpress API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.products.map((item: any) => ({
        externalId: item.id.toString(),
        name: item.title,
        description: item.description || "",
        originalPrice: Number.parseFloat(item.price),
        currency: "USD",
        images: item.images || [],
        category: item.category || "General",
        subcategory: item.subcategory,
        brand: item.brand || "Generic",
        specifications: item.specifications || {},
        variants: item.variants || {},
        stockQuantity: item.stock || 0,
        shippingInfo: {
          freeShipping: item.free_shipping || false,
          shippingTime: item.shipping_time || "7-15 days",
          shippingCost: item.shipping_cost || 0,
        },
        rating: Number.parseFloat(item.rating) || 0,
        reviewsCount: Number.parseInt(item.reviews) || 0,
      }))
    } catch (error) {
      console.error("Error fetching AliExpress products:", error)
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
        externalId: item.id.toString(),
        name: item.title,
        description: item.description || "",
        originalPrice: Number.parseFloat(item.price),
        currency: "USD",
        images: item.images || [],
        category: item.category || "General",
        subcategory: item.subcategory,
        brand: item.brand || "Generic",
        specifications: item.specifications || {},
        variants: item.variants || {},
        stockQuantity: item.stock || 0,
        shippingInfo: {
          freeShipping: item.free_shipping || false,
          shippingTime: item.shipping_time || "7-15 days",
          shippingCost: item.shipping_cost || 0,
        },
        rating: Number.parseFloat(item.rating) || 0,
        reviewsCount: Number.parseInt(item.reviews) || 0,
      }
    } catch (error) {
      console.error("Error fetching AliExpress product details:", error)
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
      return data.stock || 0
    } catch (error) {
      console.error("Error checking AliExpress stock:", error)
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
          products: orderData.items.map((item: any) => ({
            id: item.externalId,
            quantity: item.quantity,
            variant: item.variant,
          })),
          shipping_address: orderData.shippingAddress,
          customer_info: orderData.customerInfo,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const data = await response.json()
      return {
        success: true,
        externalOrderId: data.order_id,
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
      const response = await fetch(`${this.config.apiEndpoint}/orders/${externalOrderId}/tracking`, {
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
        trackingNumber: data.tracking_number,
      }
    } catch (error) {
      console.error("Error tracking AliExpress order:", error)
      return { status: "unknown" }
    }
  }
}
