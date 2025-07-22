import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') && 
  !supabaseAnonKey.includes('your_actual_anon_key_here')

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your-project-ref') || 
    supabaseAnonKey.includes('your_actual_anon_key_here')) {
  console.error('❌ Supabase not configured properly!')
  console.error('Please update your .env.local file with real Supabase credentials:')
  console.error('1. Go to your Supabase project dashboard')
  console.error('2. Navigate to Settings → API')
  console.error('3. Copy Project URL and anon key')
  console.error('4. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

// Create a mock client if Supabase is not configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null as any // Mock client for development

export const isSupabaseReady = isSupabaseConfigured

// Storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) throw error
}