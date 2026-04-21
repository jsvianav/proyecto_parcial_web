import { Link } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'
import { getImageUrl, truncate } from '../../utils/formatters'
import EmptyState from '../ui/EmptyState'

const TYPE_ICON = { artist: '🎤', album: '💿', track: '🎵' }
const TYPE_PATH = { artist: '/artist', album: '/album', track: '/track' }

export default function FavoritesList() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon="💔"
        title="No tienes favoritos aún"
        description="Explora artistas, álbumes y canciones y agrégalos a tus favoritos."
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-spotify-gray text-sm">{favorites.length} elemento{favorites.length !== 1 ? 's' : ''}</p>
        <button
          onClick={clearFavorites}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Limpiar todo
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((item) => {
          const img = getImageUrl(item.images)
          const path = TYPE_PATH[item.itemType] || '/artist'
          return (
            <div
              key={item.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(29,185,84,0.2)] transition-all duration-300"
            >
              <Link to={`${path}/${item.id}`} className="flex items-center gap-3 p-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                  {img ? (
                    <img src={img} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {TYPE_ICON[item.itemType] || '🎵'}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{truncate(item.name, 30)}</p>
                  <p className="text-spotify-gray text-xs capitalize mt-0.5">{item.itemType}</p>
                </div>
              </Link>
              <button
                onClick={() => removeFavorite(item.id)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-xs hover:bg-red-500/80 transition-colors"
                aria-label="Eliminar"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
