import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', ['1', '2'])

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [setFavorites])

  const removeFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId))
  }, [setFavorites])

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [setFavorites])

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  }
}