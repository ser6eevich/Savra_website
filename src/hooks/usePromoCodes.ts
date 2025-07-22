import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { PromoCode } from '../types'

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedPromoCodes: PromoCode[] = data.map(promo => ({
        id: promo.id,
        code: promo.code,
        discount: promo.discount,
        isActive: promo.is_active,
        usageCount: promo.usage_count,
        maxUsage: promo.max_usage,
        createdAt: new Date(promo.created_at)
      }))

      setPromoCodes(formattedPromoCodes)
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPromoCode = async (promoData: {
    code: string
    discount: number
    isActive: boolean
    maxUsage?: number
  }) => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert({
          code: promoData.code,
          discount: promoData.discount,
          is_active: promoData.isActive,
          max_usage: promoData.maxUsage,
          usage_count: 0
        })
        .select()
        .single()

      if (error) throw error

      await fetchPromoCodes() // Refresh promo codes list
      return data
    } catch (error) {
      console.error('Error adding promo code:', error)
      throw error
    }
  }

  const deletePromoCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchPromoCodes() // Refresh promo codes list
    } catch (error) {
      console.error('Error deleting promo code:', error)
      throw error
    }
  }

  const validatePromoCode = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) return null

      // Check if usage limit is reached
      if (data.max_usage && data.usage_count >= data.max_usage) {
        return null
      }

      return {
        id: data.id,
        code: data.code,
        discount: data.discount,
        isActive: data.is_active,
        usageCount: data.usage_count,
        maxUsage: data.max_usage,
        createdAt: new Date(data.created_at)
      }
    } catch (error) {
      console.error('Error validating promo code:', error)
      return null
    }
  }

  const incrementPromoUsage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({
          usage_count: supabase.sql`usage_count + 1`
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error incrementing promo usage:', error)
      throw error
    }
  }

  return {
    promoCodes,
    loading,
    addPromoCode,
    deletePromoCode,
    validatePromoCode,
    incrementPromoUsage,
    refetch: fetchPromoCodes
  }
}