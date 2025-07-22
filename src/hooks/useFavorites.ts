import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchFavorites()
    } else {
      setFavorites([])
    }
  }, [userId])

  const fetchFavorites = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', userId)

      if (error) throw error

      setFavorites(data.map(item => item.product_id))
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    }
  }

  const toggleFavorite = async (productId: string) => {
    if (!userId) return

    try {
      const isFavorite = favorites.includes(productId)

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)

        if (error) throw error

        setFavorites(prev => prev.filter(id => id !== productId))
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            product_id: productId
          })

        if (error) throw error

        setFavorites(prev => [...prev, productId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const removeFavorite = async (productId: string) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)

      if (error) throw error

      setFavorites(prev => prev.filter(id => id !== productId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  return {
    favorites,
    loading,
    toggleFavorite,
    removeFavorite,
    refetch: fetchFavorites
  }
}