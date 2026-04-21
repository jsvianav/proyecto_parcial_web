import { Link } from 'react-router-dom'
import { getImageUrl, formatDuration, truncate } from '../../utils/formatters'
import { useFavorites } from '../../context/FavoritesContext'
import { usePlayer } from '../../context/PlayerContext'

export default function TrackCard({ track }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { play, currentTrack, isPlaying } = usePlayer()
  const fav = isFavorite(track.id)
  const img = getImageUrl(track.album?.images)
  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying

  function toggleFav(e) {
    e.preventDefault()
    fav ? removeFavorite(track.id) : addFavorite({ ...track, itemType: 'track' })
  }

  function handlePlay(e) {
    e.preventDefault()
    if (track.preview_url) play(track)
  }

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all duration-300 animate-fade-in-up">
      <Link to={`/track/${track.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {img ? (
            <img src={img} alt={track.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-6xl">🎵</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {track.preview_url && (
            <button
              onClick={handlePlay}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg"
            >
              {isCurrentlyPlaying ? '⏸' : '▶'}
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold truncate">{truncate(track.name)}</h3>
          <p className="text-spotify-gray text-sm mt-1 truncate">
            {track.artists?.map((a) => a.name).join(', ')}
          </p>
          <p className="text-white/40 text-xs mt-1">{formatDuration(track.duration_ms)}</p>
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
