export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          name?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string
          video_url: string | null
          category: string
          sizes: string[] | null
          in_stock: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url: string
          video_url?: string | null
          category: string
          sizes?: string[] | null
          in_stock?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          video_url?: string | null
          category?: string
          sizes?: string[] | null
          in_stock?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          size: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          size?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          size?: string | null
          status?: string
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          product_id: string
          url: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          type?: string
          created_at?: string
        }
      }
    }
  }
}

// Типы для использования в компонентах
export type User = Database['public']['Tables']['users']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Media = Database['public']['Tables']['media']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type MediaInsert = Database['public']['Tables']['media']['Insert']