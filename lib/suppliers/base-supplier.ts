export interface SupplierConfig {
  id: string
  name: string
  type: string
  apiEndpoint: string
  apiKey?: string
  apiSecret?: string
  commissionRate: number
  settings: Record<string, any>
}

export interface SupplierProduct {
  externalId: string
  name: string
  description: string
  originalPrice: number
  currency: string
  images: string[]
  category: string
  subcategory?: string
  brand?: string
  specifications: Record<string, any>
  variants: Record<string, any>
  stockQuantity: number
  shippingInfo: Record<string, any>
  rating: number
  reviewsCount: number
}

export interface SyncResult {
  success: boolean
  productsImported: number
  productsUpdated: number
  errors: string[]
  duration: number
}

export abstract class BaseSupplier {
  protected config: SupplierConfig

  constructor(config: SupplierConfig) {
    this.config = config
  }

  abstract fetchProducts(page?: number, limit?: number): Promise<SupplierProduct[]>
  abstract fetchProductDetails(externalId: string): Promise<SupplierProduct | null>
  abstract checkStock(externalId: string): Promise<number>
  abstract createOrder(orderData: any): Promise<{ success: boolean; externalOrderId?: string; error?: string }>
  abstract trackOrder(externalOrderId: string): Promise<{ status: string; trackingNumber?: string }>

  // Méthodes communes
  calculateSellingPrice(originalPrice: number, markupPercentage: number): number {
    return Math.round(originalPrice * (1 + markupPercentage / 100) * 100) / 100
  }

  validateProduct(product: SupplierProduct): boolean {
    return !!(product.externalId && product.name && product.originalPrice > 0 && product.images.length > 0)
  }
}
