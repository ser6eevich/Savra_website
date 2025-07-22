import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { User as AppUser } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получаем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        const appUser: AppUser = {
          id: data.id,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user?.email || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          avatar: data.avatar_url || '',
          isAdmin: data.is_admin,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        }
        setProfile(appUser)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone?: string
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone
        }
      }
    })

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        date_of_birth: updates.dateOfBirth,
        avatar_url: updates.avatar
      })
      .eq('id', user.id)

    if (!error && profile) {
      setProfile({
        ...profile,
        ...updates,
        updatedAt: new Date()
      })
    }

    return { error }
  }

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}