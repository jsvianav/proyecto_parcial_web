import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useSpotifySearch } from '../hooks/useSpotifySearch'
import SearchBar from '../components/search/SearchBar'
import TypeFilter from '../components/search/TypeFilter'
import ArtistCard from '../components/cards/ArtistCard'
import AlbumCard from '../components/cards/AlbumCard'
import TrackCard from '../components/cards/TrackCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LIMIT = 20

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [type, setType] = useState('all')
  const [offset, setOffset] = useState(0)
  const [, setRecents] = useLocalStorage('spotify_recent_searches', [])

  const debouncedQuery = useDebounce(inputValue, 500)

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setInputValue(q)
    setOffset(0)
  }, [searchParams])

  const activeQuery = debouncedQuery.trim()
  const { data, loading, error } = useSpotifySearch(activeQuery, type, offset)

  function handleSearch(q) {
    setRecents((prev) => {
      const filtered = prev.filter((r) => r !== q)
      return [q, ...filtered].slice(0, 5)
    })
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setOffset(0)
  }

  function handleTypeChange(t) {
    setType(t)
    setOffset(0)
  }

  // Collect all results across sections
  const artists = data?.artists?.items || []
  const albums = data?.albums?.items || []
  const tracks = data?.tracks?.items || []

  // For pagination total, use the relevant section
  const total =
    type === 'artist'
      ? data?.artists?.total || 0
      : type === 'album'
      ? data?.albums?.total || 0
      : type === 'track'
      ? data?.tracks?.total || 0
      : Math.max(data?.artists?.total || 0, data?.albums?.total || 0, data?.tracks?.total || 0)

  const hasResults = artists.length > 0 || albums.length > 0 || tracks.length > 0

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <SearchBar
          initialValue={inputValue}
          onSearch={handleSearch}
          autoFocus
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <TypeFilter value={type} onChange={handleTypeChange} />
        {activeQuery && (
          <p className="text-white/40 text-sm ml-auto">
            {total > 0 ? `${total.toLocaleString()} resultados` : ''}
          </p>
        )}
      </div>

      {!activeQuery && (
        <EmptyState
          icon="🔍"
          title="Empieza a buscar"
          description="Escribe el nombre de un artista, álbum o canción."
        />
      )}

      {activeQuery && loading && <LoadingSpinner />}

      {activeQuery && !loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => setOffset((o) => o)}
        />
      )}

      {activeQuery && !loading && !error && !hasResults && (
        <EmptyState
          title="Sin resultados"
          description={`No encontramos nada para "${activeQuery}".`}
        />
      )}

      {!loading && !error && hasResults && (
        <div className="space-y-10">
          {(type === 'all' || type === 'artist') && artists.length > 0 && (
            <section>
              {type === 'all' && (
                <h2 className="text-white font-bold text-xl mb-4">Artistas</h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {artists.map((a) => <ArtistCard key={a.id} artist={a} />)}
              </div>
            </section>
          )}

          {(type === 'all' || type === 'album') && albums.length > 0 && (
            <section>
              {type === 'all' && (
                <h2 className="text-white font-bold text-xl mb-4">Álbumes</h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albums.map((a) => <AlbumCard key={a.id} album={a} />)}
              </div>
            </section>
          )}

          {(type === 'all' || type === 'track') && tracks.length > 0 && (
            <section>
              {type === 'all' && (
                <h2 className="text-white font-bold text-xl mb-4">Canciones</h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {tracks.map((t) => <TrackCard key={t.id} track={t} />)}
              </div>
            </section>
          )}

          <Pagination
            offset={offset}
            limit={LIMIT}
            total={total}
            onPrev={() => setOffset((o) => Math.max(0, o - LIMIT))}
            onNext={() => setOffset((o) => o + LIMIT)}
          />
        </div>
      )}
    </div>
  )
}
