import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Типы для базы данных
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
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
          detailed_description: string
          price: number
          category: string
          collection: string
          article: string
          material: string
          type: string
          sizes: string[]
          images: string[]
          video_url: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          detailed_description?: string
          price: number
          category?: string
          collection?: string
          article?: string
          material?: string
          type?: string
          sizes?: string[]
          images?: string[]
          video_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          detailed_description?: string
          price?: number
          category?: string
          collection?: string
          article?: string
          material?: string
          type?: string
          sizes?: string[]
          images?: string[]
          video_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}