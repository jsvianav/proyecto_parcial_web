import { Link } from 'react-router-dom'
import { getImageUrl, formatNumber } from '../../utils/formatters'
import { useFavorites } from '../../context/FavoritesContext'

export default function ArtistCard({ artist }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const fav = isFavorite(artist.id)
  const img = getImageUrl(artist.images)

  function toggleFav(e) {
    e.preventDefault()
    fav ? removeFavorite(artist.id) : addFavorite({ ...artist, itemType: 'artist' })
  }

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all duration-300 animate-fade-in-up">
      <Link to={`/artist/${artist.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {img ? (
            <img src={img} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-6xl">🎤</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold truncate">{artist.name}</h3>
          <p className="text-spotify-gray text-sm mt-1">
            {formatNumber(artist.followers?.total)} seguidores
          </p>
          {artist.genres?.length > 0 && (
            <p className="text-spotify-green text-xs mt-1 truncate">{artist.genres.slice(0, 2).join(', ')}</p>
          )}
        </div>
      </Link>
      <button
        onClick={toggleFav}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
        aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
