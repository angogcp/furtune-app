import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// 检查是否配置了有效的Supabase URL
const isValidConfig = supabaseUrl !== 'https://placeholder.supabase.co' && 
                     supabaseUrl !== 'https://your-project.supabase.co' &&
                     supabaseAnonKey !== 'placeholder-key' &&
                     supabaseAnonKey !== 'your-anon-key-here' &&
                     supabaseUrl.includes('.supabase.co') &&
                     !supabaseUrl.includes('your-project') &&
                     !supabaseAnonKey.includes('your-anon-key')

if (!isValidConfig) {
  console.warn('⚠️ Supabase未正确配置。请在.env文件中设置VITE_SUPABASE_URL和VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { isValidConfig as isSupabaseConfigured }

// Database types
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  last_sign_in: string | null
  sign_in_streak: number
  total_sign_ins: number
}

export interface DailyFortune {
  id: string
  user_id: string
  date: string
  fortune_type: string
  fortune_content: string
  created_at: string
}

export interface Wish {
  id: string
  user_id: string | null
  content: string
  is_anonymous: boolean
  created_at: string
  likes: number
}

export interface SignIn {
  id: string
  user_id: string
  date: string
  created_at: string
}