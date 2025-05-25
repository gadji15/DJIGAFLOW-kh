export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          role: "customer" | "admin" | "supplier"
          is_active: boolean
          email_verified: boolean
          last_login: string | null
          preferences: Json
          shipping_addresses: Json
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "customer" | "admin" | "supplier"
          is_active?: boolean
          email_verified?: boolean
          preferences?: Json
          shipping_addresses?: Json
        }
        Update: {
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "customer" | "admin" | "supplier"
          is_active?: boolean
          email_verified?: boolean
          last_login?: string | null
          preferences?: Json
          shipping_addresses?: Json
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          seo_keywords: string[] | null
        }
        Insert: {
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          seo_keywords?: string[] | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          seo_keywords?: string[] | null
        }
      }
      suppliers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          type: "aliexpress" | "jumia" | "amazon" | "dhgate" | "alibaba" | "other"
          website_url: string | null
          api_endpoint: string | null
          api_key: string | null
          api_secret: string | null
          access_token: string | null
          refresh_token: string | null
          commission_rate: number
          status: "active" | "inactive" | "suspended"
          last_sync: string | null
          sync_frequency: number
          auto_sync: boolean
          settings: Json
          contact_info: Json
          shipping_zones: string[]
          currency: string
          min_order_amount: number
          processing_time_days: number
        }
        Insert: {
          name: string
          type: "aliexpress" | "jumia" | "amazon" | "dhgate" | "alibaba" | "other"
          website_url?: string | null
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          access_token?: string | null
          refresh_token?: string | null
          commission_rate?: number
          status?: "active" | "inactive" | "suspended"
          sync_frequency?: number
          auto_sync?: boolean
          settings?: Json
          contact_info?: Json
          shipping_zones?: string[]
          currency?: string
          min_order_amount?: number
          processing_time_days?: number
        }
        Update: {
          name?: string
          type?: "aliexpress" | "jumia" | "amazon" | "dhgate" | "alibaba" | "other"
          website_url?: string | null
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          access_token?: string | null
          refresh_token?: string | null
          commission_rate?: number
          status?: "active" | "inactive" | "suspended"
          last_sync?: string | null
          sync_frequency?: number
          auto_sync?: boolean
          settings?: Json
          contact_info?: Json
          shipping_zones?: string[]
          currency?: string
          min_order_amount?: number
          processing_time_days?: number
        }
      }
      supplier_products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          supplier_id: string
          external_id: string
          name: string
          description: string | null
          short_description: string | null
          original_price: number
          sale_price: number | null
          currency: string
          images: string[]
          category: string | null
          subcategory: string | null
          brand: string | null
          model: string | null
          sku: string | null
          barcode: string | null
          specifications: Json
          variants: Json
          stock_quantity: number
          min_order_quantity: number
          shipping_info: Json
          dimensions: Json
          weight: number | null
          rating: number
          reviews_count: number
          tags: string[]
          status: "active" | "inactive" | "out_of_stock" | "discontinued"
          is_featured: boolean
          last_stock_check: string | null
        }
        Insert: {
          supplier_id: string
          external_id: string
          name: string
          description?: string | null
          short_description?: string | null
          original_price: number
          sale_price?: number | null
          currency?: string
          images?: string[]
          category?: string | null
          subcategory?: string | null
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          specifications?: Json
          variants?: Json
          stock_quantity?: number
          min_order_quantity?: number
          shipping_info?: Json
          dimensions?: Json
          weight?: number | null
          rating?: number
          reviews_count?: number
          tags?: string[]
          status?: "active" | "inactive" | "out_of_stock" | "discontinued"
          is_featured?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          short_description?: string | null
          original_price?: number
          sale_price?: number | null
          currency?: string
          images?: string[]
          category?: string | null
          subcategory?: string | null
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          specifications?: Json
          variants?: Json
          stock_quantity?: number
          min_order_quantity?: number
          shipping_info?: Json
          dimensions?: Json
          weight?: number | null
          rating?: number
          reviews_count?: number
          tags?: string[]
          status?: "active" | "inactive" | "out_of_stock" | "discontinued"
          is_featured?: boolean
          last_stock_check?: string | null
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          supplier_product_id: string | null
          category_id: string | null
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          sale_price: number | null
          cost_price: number | null
          markup_percentage: number
          profit_margin: number
          currency: string
          images: string[]
          brand: string | null
          model: string | null
          sku: string | null
          barcode: string | null
          specifications: Json
          variants: Json
          stock: number
          min_stock_level: number
          max_stock_level: number
          weight: number | null
          dimensions: Json
          shipping_class: string
          tax_class: string
          status: "draft" | "active" | "inactive" | "out_of_stock"
          visibility: "public" | "private" | "hidden"
          featured: boolean
          auto_sync: boolean
          rating: number
          reviews_count: number
          total_sales: number
          views_count: number
          tags: string[]
          meta_title: string | null
          meta_description: string | null
          seo_keywords: string[] | null
          last_sync: string | null
        }
        Insert: {
          name: string
          slug: string
          price: number
          description?: string | null
          short_description?: string | null
          supplier_product_id?: string | null
          category_id?: string | null
          sale_price?: number | null
          cost_price?: number | null
          markup_percentage?: number
          currency?: string
          images?: string[]
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          specifications?: Json
          variants?: Json
          stock?: number
          min_stock_level?: number
          max_stock_level?: number
          weight?: number | null
          dimensions?: Json
          shipping_class?: string
          tax_class?: string
          status?: "draft" | "active" | "inactive" | "out_of_stock"
          visibility?: "public" | "private" | "hidden"
          featured?: boolean
          auto_sync?: boolean
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          seo_keywords?: string[] | null
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          sale_price?: number | null
          cost_price?: number | null
          markup_percentage?: number
          currency?: string
          images?: string[]
          brand?: string | null
          model?: string | null
          sku?: string | null
          barcode?: string | null
          specifications?: Json
          variants?: Json
          stock?: number
          min_stock_level?: number
          max_stock_level?: number
          weight?: number | null
          dimensions?: Json
          shipping_class?: string
          tax_class?: string
          status?: "draft" | "active" | "inactive" | "out_of_stock"
          visibility?: "public" | "private" | "hidden"
          featured?: boolean
          auto_sync?: boolean
          rating?: number
          reviews_count?: number
          total_sales?: number
          views_count?: number
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          seo_keywords?: string[] | null
          last_sync?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          order_number: string
          user_id: string | null
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "error"
          payment_status: "pending" | "paid" | "failed" | "refunded" | "partial"
          payment_method: string | null
          payment_id: string | null
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total: number
          currency: string
          billing_address: Json
          shipping_address: Json
          customer_notes: string | null
          admin_notes: string | null
          tracking_number: string | null
          shipped_at: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          coupon_code: string | null
          referral_source: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          order_number?: string
          user_id?: string | null
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "error"
          payment_status?: "pending" | "paid" | "failed" | "refunded" | "partial"
          payment_method?: string | null
          payment_id?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total?: number
          currency?: string
          billing_address: Json
          shipping_address: Json
          customer_notes?: string | null
          admin_notes?: string | null
          tracking_number?: string | null
          estimated_delivery?: string | null
          coupon_code?: string | null
          referral_source?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "error"
          payment_status?: "pending" | "paid" | "failed" | "refunded" | "partial"
          payment_method?: string | null
          payment_id?: string | null
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total?: number
          billing_address?: Json
          shipping_address?: Json
          customer_notes?: string | null
          admin_notes?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          coupon_code?: string | null
          referral_source?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string
          supplier_product_id: string | null
          name: string
          sku: string | null
          price: number
          cost_price: number | null
          quantity: number
          total: number
          profit: number
          variant: Json
          product_snapshot: Json
        }
        Insert: {
          order_id: string
          product_id: string
          supplier_product_id?: string | null
          name: string
          sku?: string | null
          price: number
          cost_price?: number | null
          quantity?: number
          total: number
          profit?: number
          variant?: Json
          product_snapshot?: Json
        }
        Update: {
          name?: string
          sku?: string | null
          price?: number
          cost_price?: number | null
          quantity?: number
          total?: number
          profit?: number
          variant?: Json
          product_snapshot?: Json
        }
      }
      supplier_orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          order_id: string
          supplier_id: string
          external_order_id: string | null
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "error"
          total_amount: number
          supplier_amount: number
          our_profit: number
          currency: string
          tracking_number: string | null
          shipping_status: string | null
          estimated_delivery: string | null
          actual_delivery: string | null
          shipping_cost: number
          notes: string | null
          error_message: string | null
          retry_count: number
          last_retry: string | null
        }
        Insert: {
          order_id: string
          supplier_id: string
          external_order_id?: string | null
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "error"
          total_amount: number
          supplier_amount: number
          our_profit: number
          currency?: string
          tracking_number?: string | null
          shipping_status?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          shipping_cost?: number
          notes?: string | null
          error_message?: string | null
          retry_count?: number
        }
        Update: {
          external_order_id?: string | null
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "error"
          total_amount?: number
          supplier_amount?: number
          our_profit?: number
          currency?: string
          tracking_number?: string | null
          shipping_status?: string | null
          estimated_delivery?: string | null
          actual_delivery?: string | null
          shipping_cost?: number
          notes?: string | null
          error_message?: string | null
          retry_count?: number
          last_retry?: string | null
        }
      }
      sync_logs: {
        Row: {
          id: string
          created_at: string
          supplier_id: string | null
          sync_type: "products" | "prices" | "stock" | "orders" | "full"
          status: "running" | "success" | "error" | "partial" | "cancelled"
          started_at: string
          completed_at: string | null
          products_processed: number
          products_imported: number
          products_updated: number
          products_failed: number
          errors_count: number
          duration_ms: number | null
          error_details: Json
          summary: Json
          triggered_by: "manual" | "cron" | "webhook" | "api"
        }
        Insert: {
          supplier_id?: string | null
          sync_type: "products" | "prices" | "stock" | "orders" | "full"
          status?: "running" | "success" | "error" | "partial" | "cancelled"
          started_at?: string
          completed_at?: string | null
          products_processed?: number
          products_imported?: number
          products_updated?: number
          products_failed?: number
          errors_count?: number
          duration_ms?: number | null
          error_details?: Json
          summary?: Json
          triggered_by?: "manual" | "cron" | "webhook" | "api"
        }
        Update: {
          status?: "running" | "success" | "error" | "partial" | "cancelled"
          completed_at?: string | null
          products_processed?: number
          products_imported?: number
          products_updated?: number
          products_failed?: number
          errors_count?: number
          duration_ms?: number | null
          error_details?: Json
          summary?: Json
        }
      }
      pricing_rules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          supplier_id: string | null
          category_id: string | null
          brand: string | null
          min_price: number | null
          max_price: number | null
          markup_type: "percentage" | "fixed" | "formula"
          markup_value: number
          min_profit: number
          max_profit: number | null
          is_active: boolean
          priority: number
          conditions: Json
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          name: string
          description?: string | null
          supplier_id?: string | null
          category_id?: string | null
          brand?: string | null
          min_price?: number | null
          max_price?: number | null
          markup_type?: "percentage" | "fixed" | "formula"
          markup_value: number
          min_profit?: number
          max_profit?: number | null
          is_active?: boolean
          priority?: number
          conditions?: Json
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          supplier_id?: string | null
          category_id?: string | null
          brand?: string | null
          min_price?: number | null
          max_price?: number | null
          markup_type?: "percentage" | "fixed" | "formula"
          markup_value?: number
          min_profit?: number
          max_profit?: number | null
          is_active?: boolean
          priority?: number
          conditions?: Json
          valid_from?: string | null
          valid_until?: string | null
        }
      }
      system_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          key: string
          value: Json
          description: string | null
          category: string
          is_public: boolean
          is_encrypted: boolean
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          category?: string
          is_public?: boolean
          is_encrypted?: boolean
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          category?: string
          is_public?: boolean
          is_encrypted?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      calculate_selling_price: {
        Args: {
          original_price: number
          markup_percentage: number
        }
        Returns: number
      }
      update_product_rating: {
        Args: {
          product_uuid: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
