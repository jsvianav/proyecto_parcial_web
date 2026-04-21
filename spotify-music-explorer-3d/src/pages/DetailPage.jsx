import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArtist, getArtistTopTracks, getArtistAlbums, getAlbum, getTrack } from '../services/spotifyAPI'
import { getImageUrl, formatNumber, formatDuration, truncate } from '../utils/formatters'
import { useFavorites } from '../context/FavoritesContext'
import { usePlayer } from '../context/PlayerContext'
import VinylScene from '../components/three/VinylScene'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import AlbumCard from '../components/cards/AlbumCard'
import { Link } from 'react-router-dom'

export default function DetailPage({ type }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [extras, setExtras] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { play, pause, stop, currentTrack, isPlaying } = usePlayer()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)
    setExtras(null)

    async function load() {
      try {
        if (type === 'artist') {
          const [artist, topTracks, albums] = await Promise.all([
            getArtist(id),
            getArtistTopTracks(id),
            getArtistAlbums(id),
          ])
          if (!cancelled) {
            setData(artist)
            setExtras({ topTracks: topTracks.tracks, albums: albums.items })
          }
        } else if (type === 'album') {
          const album = await getAlbum(id)
          if (!cancelled) setData(album)
        } else if (type === 'track') {
          const track = await getTrack(id)
          if (!cancelled) setData(track)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id, type])

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>
  if (error) return (
    <div className="pt-24">
      <ErrorMessage message={error} onRetry={() => navigate(0)} />
    </div>
  )
  if (!data) return null

  const img = getImageUrl(data.images || data.album?.images, 'large')
  const fav = isFavorite(data.id)

  function toggleFav() {
    fav ? removeFavorite(data.id) : addFavorite({ ...data, itemType: type })
  }

  function handlePlayTrack(track) {
    if (!track.preview_url) return
    if (currentTrack?.id === track.id && isPlaying) {
      pause()
    } else {
      play(track)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Vinyl 3D */}
        <div className="w-full lg:w-[380px] h-64 lg:h-[420px] flex-shrink-0 rounded-2xl overflow-hidden bg-black/40">
          <VinylScene imageUrl={img} />
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0">
          <p className="text-spotify-green text-sm font-semibold uppercase tracking-widest mb-1">
            {type === 'artist' ? 'Artista' : type === 'album' ? 'Álbum' : 'Canción'}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{data.name}</h1>

          {type === 'artist' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-white font-bold text-2xl">{formatNumber(data.followers?.total)}</p>
                  <p className="text-white/50 text-xs">Seguidores</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-2xl">{data.popularity}</p>
                  <p className="text-white/50 text-xs">Popularidad</p>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2 max-w-xs">
                <div
                  className="bg-spotify-green h-2 rounded-full transition-all"
                  style={{ width: `${data.popularity}%` }}
                />
              </div>
              {data.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.genres.slice(0, 5).map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">{g}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === 'album' && (
            <div className="mt-4 space-y-2">
              <p className="text-white/60">
                {data.artists?.map((a) => (
                  <Link key={a.id} to={`/artist/${a.id}`} className="hover:text-spotify-green transition-colors">
                    {a.name}
                  </Link>
                ))}
              </p>
              <p className="text-white/40 text-sm">
                {data.release_date?.slice(0, 4)} · {data.total_tracks} canciones
              </p>
              {data.genres?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {data.genres.map((g) => (
                    <span key={g} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60">{g}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === 'track' && (
            <div className="mt-4 space-y-2">
              <p className="text-white/60">
                {data.artists?.map((a, i) => (
                  <span key={a.id}>
                    <Link to={`/artist/${a.id}`} className="hover:text-spotify-green transition-colors">{a.name}</Link>
                    {i < data.artists.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="text-white/40 text-sm">
                <Link to={`/album/${data.album?.id}`} className="hover:text-spotify-green transition-colors">
                  {data.album?.name}
                </Link>
                {' · '}{formatDuration(data.duration_ms)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 max-w-xs bg-white/10 rounded-full h-2">
                  <div
                    className="bg-spotify-green h-2 rounded-full"
                    style={{ width: `${data.popularity}%` }}
                  />
                </div>
                <span className="text-white/40 text-xs">{data.popularity}/100</span>
              </div>
              {data.preview_url && (
                <button
                  onClick={() => handlePlayTrack(data)}
                  className="mt-4 flex items-center gap-3 bg-spotify-green text-black font-bold rounded-full px-6 py-3 hover:bg-green-400 transition-colors"
                >
                  {currentTrack?.id === data.id && isPlaying ? '⏸ Pausar' : '▶ Reproducir preview'}
                </button>
              )}
              {!data.preview_url && (
                <p className="text-white/30 text-sm mt-3 italic">Preview no disponible</p>
              )}
            </div>
          )}

          <button
            onClick={toggleFav}
            className={`mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold text-sm transition-all ${
              fav
                ? 'border-spotify-green bg-spotify-green/20 text-spotify-green'
                : 'border-white/30 text-white hover:border-spotify-green'
            }`}
          >
            {fav ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
          </button>
        </div>
      </div>

      {/* Artist top tracks */}
      {type === 'artist' && extras?.topTracks?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-white font-bold text-2xl mb-4">Top Canciones</h2>
          <div className="space-y-2">
            {extras.topTracks.slice(0, 10).map((track, i) => {
              const tImg = getImageUrl(track.album?.images, 'small')
              const playing = currentTrack?.id === track.id && isPlaying
              return (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <span className="text-white/30 w-5 text-sm text-right">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                    {tImg && <img src={tImg} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/track/${track.id}`} className="text-white text-sm font-medium hover:text-spotify-green truncate block">
                      {track.name}
                    </Link>
                    <p className="text-white/40 text-xs">{formatDuration(track.duration_ms)}</p>
                  </div>
                  {track.preview_url && (
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {playing ? '⏸' : '▶'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Artist albums */}
      {type === 'artist' && extras?.albums?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-white font-bold text-2xl mb-4">Discografía</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {extras.albums.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </section>
      )}

      {/* Album tracklist */}
      {type === 'album' && data.tracks?.items?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-white font-bold text-2xl mb-4">Canciones</h2>
          <div className="space-y-2">
            {data.tracks.items.map((track, i) => {
              const playing = currentTrack?.id === track.id && isPlaying
              return (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <span className="text-white/30 w-5 text-sm text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link to={`/track/${track.id}`} className="text-white text-sm font-medium hover:text-spotify-green truncate block">
                      {track.name}
                    </Link>
                    <p className="text-white/40 text-xs">
                      {track.artists?.map((a) => a.name).join(', ')} · {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                  {track.preview_url && (
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {playing ? '⏸' : '▶'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
