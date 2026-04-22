import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useSpotifySearch } from '../hooks/useSpotifySearch'
import SearchBar from '../components/search/SearchBar'
import TypeFilter from '../components/search/TypeFilter'
import ArtistCard from '../components/cards/ArtistCard'
import AlbumCard from '../components/cards/AlbumCard'
import TrackCard from '../components/cards/TrackCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import EmptyState from '../components/ui/EmptyState'
import CardGrid from '../components/ui/CardGrid'
import SecTitle from '../components/ui/SecTitle'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LIMIT = 20

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [type, setType]     = useState('all')
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
    setRecents(prev => [q, ...prev.filter(r => r !== q)].slice(0, 6))
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setOffset(0)
  }

  function handleType(t) { setType(t); setOffset(0) }

  const artists = (type === 'all' || type === 'artist') ? (data?.artists?.items || []) : []
  const albums  = (type === 'all' || type === 'album')  ? (data?.albums?.items  || []) : []
  const tracks  = (type === 'all' || type === 'track')  ? (data?.tracks?.items  || []) : []
  const total   = artists.length + albums.length + tracks.length
  const hasRes  = total > 0

  const totalPages = Math.ceil(
    Math.max(data?.artists?.total || 0, data?.albums?.total || 0, data?.tracks?.total || 0) / LIMIT
  )
  const page = Math.floor(offset / LIMIT) + 1

  return (
    <div className="page-anim" style={{ minHeight: '100vh', paddingTop: 62 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 28px 64px' }}>

        <div style={{ marginBottom: 20 }}>
          <SearchBar value={inputValue} onChange={setInputValue} onSearch={handleSearch} autoFocus={!activeQuery} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
          <TypeFilter value={type} onChange={handleType} />
          {activeQuery && !loading && hasRes && (
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              {total} resultado{total !== 1 ? 's' : ''} para{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>"{activeQuery}"</strong>
            </span>
          )}
        </div>

        {/* Empty */}
        {!activeQuery && (
          <EmptyState
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
            title="Empieza a buscar"
            description="Escribe el nombre de un artista, álbum o canción para explorar."
          />
        )}

        {/* Skeleton */}
        {activeQuery && loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[0, 1, 2].map(s => (
              <div key={s}>
                <div className="skeleton" style={{ height: 16, width: 100, marginBottom: 14, borderRadius: 6 }} />
                <CardGrid>{[0,1,2,3,4].map(i => <SkeletonCard key={i} />)}</CardGrid>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {activeQuery && !loading && error && (
          <EmptyState
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            title="Error al buscar" description={error}
            action="Reintentar" onAction={() => setOffset(o => o)}
          />
        )}

        {/* Results */}
        {!loading && !error && hasRes && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {artists.length > 0 && (
              <section>
                {type === 'all' && <SecTitle count={artists.length}>Artistas</SecTitle>}
                <CardGrid>{artists.map((a, i) => <ArtistCard key={a.id} artist={a} idx={i} />)}</CardGrid>
              </section>
            )}
            {albums.length > 0 && (
              <section>
                {type === 'all' && <SecTitle count={albums.length}>Álbumes</SecTitle>}
                <CardGrid>{albums.map((a, i) => <AlbumCard key={a.id} album={a} idx={i} />)}</CardGrid>
              </section>
            )}
            {tracks.length > 0 && (
              <section>
                {type === 'all' && <SecTitle count={tracks.length}>Canciones</SecTitle>}
                <CardGrid>{tracks.map((t, i) => <TrackCard key={t.id} track={t} idx={i} />)}</CardGrid>
              </section>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <PagBtn disabled={page <= 1} onClick={() => setOffset(o => Math.max(0, o - LIMIT))}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </PagBtn>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 110, textAlign: 'center' }}>
                  Página <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> de {totalPages}
                </span>
                <PagBtn disabled={page >= totalPages} onClick={() => setOffset(o => o + LIMIT)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </PagBtn>
              </div>
            )}
          </div>
        )}

        {!loading && !error && activeQuery && !hasRes && data !== null && (
          <EmptyState title="Sin resultados"
            description={`No encontramos nada para "${activeQuery}". Prueba otros términos.`} />
        )}
      </div>
    </div>
  )
}

function PagBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 36, height: 36, borderRadius: 9, background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)', cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
      opacity: disabled ? 0.4 : 1, transition: 'all 0.15s',
    }}>{children}</button>
  )
}
