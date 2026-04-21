import { Link } from 'react-router-dom'
import { getImageUrl, truncate } from '../../utils/formatters'
import { useFavorites } from '../../context/FavoritesContext'

export default function AlbumCard({ album }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const fav = isFavorite(album.id)
  const img = getImageUrl(album.images)

  function toggleFav(e) {
    e.preventDefault()
    fav ? removeFavorite(album.id) : addFavorite({ ...album, itemType: 'album' })
  }

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all duration-300 animate-fade-in-up">
      <Link to={`/album/${album.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {img ? (
            <img src={img} alt={album.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-6xl">💿</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold truncate">{truncate(album.name)}</h3>
          <p className="text-spotify-gray text-sm mt-1 truncate">
            {album.artists?.map((a) => a.name).join(', ')}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {album.release_date?.slice(0, 4)} · {album.total_tracks} canciones
          </p>
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
