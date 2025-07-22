import { useState, useEffect } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Быстрая инициализация без ожидания Supabase
    const initAuth = async () => {
      try {
        // Проверяем сессию с таймаутом
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any
        
        if (session?.user) {
          await loadUserProfile(session.user)
        }
      } catch (error) {
        console.warn('Auth initialization timeout or error:', error)
        // Продолжаем без аутентификации
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Слушаем изменения аутентификации (без блокировки загрузки)
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
          setIsLoggedIn(false)
        }
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('Auth state change listener error:', error)
      setLoading(false)
    }
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        return
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          dateOfBirth: profile.date_of_birth,
          avatar: profile.avatar_url,
          role: profile.role || 'client',
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        }
        
        setUser(userData)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        await loadUserProfile(data.user)
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            email: userData.email
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      
      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          date_of_birth: updates.dateOfBirth,
          avatar_url: updates.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      // Обновляем локальное состояние
      setUser(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile
  }
}