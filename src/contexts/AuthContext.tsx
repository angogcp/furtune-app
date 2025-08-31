import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { networkManager } from '../utils/networkManager'

interface UserProfile {
  id: string
  email: string
  username: string
  created_at: string
  sign_in_streak: number
  total_sign_ins: number
}

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: UserProfile | null
  loading: boolean
  isSupabaseConfigured: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  useEffect(() => {
    // Check Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    // Check if Supabase is properly configured (not using placeholder values)
    const isValidConfig = supabaseUrl && 
                         supabaseAnonKey && 
                         supabaseUrl !== 'https://placeholder.supabase.co' && 
                         supabaseUrl !== 'https://your-project.supabase.co' &&
                         supabaseAnonKey !== 'placeholder_anon_key' &&
                         supabaseAnonKey !== 'your-anon-key-here' &&
                         supabaseUrl.includes('.supabase.co') &&
                         !supabaseUrl.includes('placeholder')
    
    if (isValidConfig) {
      setIsSupabaseConfigured(true)
      initializeAuth()
    } else {
      console.warn('Supabase not configured or using placeholder values')
      setIsSupabaseConfigured(false)
      setLoading(false)
    }
  }, [])

  const initializeAuth = async () => {
    try {
      // Get initial session with network retry
      const { data: { session }, error } = await networkManager.executeWithRetry(
        () => supabase.auth.getSession(),
        2
      )

      if (error) {
        console.error('Failed to get initial session:', error)
        networkManager.showNetworkError('无法获取登录状态，请检查网络连接')
      } else if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.id)
      }
    } catch (error: any) {
      console.error('Auth initialization failed:', error)
      if (error.message.includes('网络') || error.message.includes('连接')) {
        networkManager.showNetworkError(error.message)
      }
    } finally {
      setLoading(false)
    }

    // Set up auth state listener with enhanced error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        // Handle token refresh failures
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed - signing out user')
          networkManager.showNetworkError('登录已过期，请重新登录')
          setUser(null)
          setUserProfile(null)
          return
        }

        // Handle signed in state
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
          networkManager.showNetworkSuccess('登录成功')
        }

        // Handle signed out state
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserProfile(null)
        }

        // Handle user updates
        if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }

  const fetchUserProfile = async (userId: string, retryCount: number = 0): Promise<void> => {
    const maxRetries = 3
    
    try {
      const { data, error } = await networkManager.executeWithRetry(
        async () => await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single(),
        2
      )

      if (error) {
        // Handle specific error cases
        if (error.code === 'PGRST116') {
          console.log('User profile not found, this might be expected for new users')
          return
        }
        
        throw error
      }

      if (data) {
        setUserProfile(data)
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error)
      
      // Retry logic for network errors
      if (retryCount < maxRetries && networkManager.getState().isSupabaseConnected) {
        const delay = 1000 * Math.pow(2, retryCount)
        console.log(`Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`)
        
        setTimeout(() => {
          fetchUserProfile(userId, retryCount + 1)
        }, delay)
      } else if (retryCount === 0) {
        // Only show error on first attempt to avoid spam
        networkManager.showNetworkError('无法获取用户资料，请检查网络连接')
      }
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    if (!isSupabaseConfigured) {
      return { error: '请先配置 Supabase 环境变量才能使用注册功能' }
    }

    try {
      await networkManager.executeWithRetry(async () => {
        // Check if username already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (existingUser) {
          throw new Error('用户名已存在，请选择其他用户名')
        }

        // Get the current site URL for redirects
        const getSiteUrl = () => {
          // In production, use the actual deployed URL
          if (import.meta.env.PROD) {
            return window.location.origin
          }
          // In development, use localhost with correct port
          return 'http://localhost:5173'
        }

        // Create auth user with username in metadata
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username
            },
            emailRedirectTo: getSiteUrl()
          }
        })

        if (signUpError) {
          // Handle specific Supabase auth errors
          if (signUpError.message.includes('User already registered')) {
            throw new Error('该邮箱已被注册，请使用其他邮箱或尝试登录')
          } else if (signUpError.message.includes('Password should be at least')) {
            throw new Error('密码至少需要6个字符')
          } else if (signUpError.message.includes('Invalid email')) {
            throw new Error('请输入有效的邮箱地址')
          } else {
            throw new Error(signUpError.message || '注册失败，请重试')
          }
        }

        if (!data.user) {
          throw new Error('注册失败，请重试')
        }

        // The user profile will be created automatically by the database trigger
        // We don't need to manually insert into the users table
      })

      networkManager.showNetworkSuccess('注册成功！请检查邮箱验证链接')
      return {}
    } catch (error: any) {
      console.error('Sign up error:', error)
      const errorMessage = error.message || '注册失败，请重试'
      networkManager.showNetworkError(errorMessage)
      return { error: errorMessage }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: '请先配置 Supabase 环境变量才能使用登录功能' }
    }

    try {
      await networkManager.executeWithRetry(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          // Handle specific auth errors
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('邮箱或密码错误，请检查后重试')
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('请先验证您的邮箱地址')
          } else {
            throw error
          }
        }
      })
      
      return {}
    } catch (error: any) {
      console.error('Sign in error:', error)
      const errorMessage = error.message || '登录失败，请重试'
      networkManager.showNetworkError(errorMessage)
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return
    }
    
    try {
      await networkManager.executeWithRetry(
        () => supabase.auth.signOut(),
        2
      )
      networkManager.showNetworkSuccess('已安全退出')
    } catch (error: any) {
      console.error('Sign out error:', error)
      // Force local sign out even if network request fails
      setUser(null)
      setUserProfile(null)
      networkManager.showNetworkError('退出时发生错误，但已清除本地登录状态')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) {
      return { error: '用户未登录' }
    }

    try {
      const { error } = await networkManager.executeWithRetry(
        async () => await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id),
        2
      )

      if (error) {
        throw error
      }

      // Update local state
      setUserProfile({ ...userProfile, ...updates })
      networkManager.showNetworkSuccess('资料更新成功')
      return {}
    } catch (error: any) {
      console.error('Update profile error:', error)
      const errorMessage = error.message || '更新资料失败，请重试'
      networkManager.showNetworkError(errorMessage)
      return { error: errorMessage }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
