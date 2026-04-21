import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('spotify_favorites', [])

  function addFavorite(item) {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === item.id)) return prev
      return [...prev, item]
    })
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  function isFavorite(id) {
    return favorites.some((f) => f.id === id)
  }

  function clearFavorites() {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
