import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = 'https://nupkezerojwzqdqnzslh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cGtlemVyb2p3enFkcW56c2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTY5MTksImV4cCI6MjA2ODY5MjkxOX0.al-iyxUG22RvVkUBwh7XO-JSnAFn-U2GkwAiztYizdY'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)