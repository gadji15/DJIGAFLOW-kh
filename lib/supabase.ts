import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Client-side Supabase client
export const supabase = createClientComponentClient()

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Admin client for server-side operations
export const supabaseAdmin = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          sale_price: number | null
          stock: number
          category_id: string | null
          images: string[]
          featured: boolean
          rating: number | null
          reviews_count: number
          specifications: Record<string, any> | null
          variants: Record<string, any> | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          sale_price?: number | null
          stock?: number
          category_id?: string | null
          images?: string[]
          featured?: boolean
          rating?: number | null
          reviews_count?: number
          specifications?: Record<string, any> | null
          variants?: Record<string, any> | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          slug?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          stock?: number
          category_id?: string | null
          images?: string[]
          featured?: boolean
          rating?: number | null
          reviews_count?: number
          specifications?: Record<string, any> | null
          variants?: Record<string, any> | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          slug?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          parent_id: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug?: string
          parent_id?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          parent_id?: string | null
          image_url?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          shipping_address: Record<string, any>
          billing_address: Record<string, any> | null
          payment_method: string
          payment_status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total: number
          shipping_address: Record<string, any>
          billing_address?: Record<string, any> | null
          payment_method: string
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          shipping_address?: Record<string, any>
          billing_address?: Record<string, any> | null
          payment_method?: string
          payment_status?: string
          notes?: string | null
          updated_at?: string
        }
      }
    }
  }
}
