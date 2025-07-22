export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          detailed_description: string | null
          price: number
          category: string
          collection: string | null
          article: string | null
          material: string
          type: string
          sizes: string[]
          images: string[]
          video_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          detailed_description?: string | null
          price: number
          category: string
          collection?: string | null
          article?: string | null
          material?: string
          type?: string
          sizes?: string[]
          images?: string[]
          video_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          detailed_description?: string | null
          price?: number
          category?: string
          collection?: string | null
          article?: string | null
          material?: string
          type?: string
          sizes?: string[]
          images?: string[]
          video_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: Json
          total: number
          status: string
          order_type: string
          promo_code: string | null
          discount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: Json
          total: number
          status?: string
          order_type: string
          promo_code?: string | null
          discount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: Json
          total?: number
          status?: string
          order_type?: string
          promo_code?: string | null
          discount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          discount: number
          is_active: boolean
          usage_count: number
          max_usage: number | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount: number
          is_active?: boolean
          usage_count?: number
          max_usage?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount?: number
          is_active?: boolean
          usage_count?: number
          max_usage?: number | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}