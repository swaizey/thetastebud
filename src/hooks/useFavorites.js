import { useEffect, useState } from 'react'
import { readFavorites, saveFavorites } from '../utils/accountStorage.js'

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const toggleFavorite = (productId) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    )
  }

  const removeFavorite = (productId) => {
    setFavorites((current) => current.filter((id) => id !== productId))
  }

  return { favorites, toggleFavorite, removeFavorite }
}
