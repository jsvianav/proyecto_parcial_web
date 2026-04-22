import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { showToast } from '../utils/toast'
import ArtistCard from '../components/cards/ArtistCard'
import AlbumCard from '../components/cards/AlbumCard'
import TrackCard from '../components/cards/TrackCard'
import CardGrid from '../components/ui/CardGrid'
import EmptyState from '../components/ui/EmptyState'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, clearFavorites } = useFavorites()
  const [filter, setFilter] = useState('all')

  const artists = favorites.filter(f => f.itemType === 'artist')
  const albums  = favorites.filter(f => f.itemType === 'album')
  const tracks  = favorites.filter(f => f.itemType === 'track')

  const tabs = [
    { v: 'all',    l: `Todos (${favorites.length})` },
    { v: 'artist', l: `Artistas (${artists.length})` },
    { v: 'album',  l: `Álbumes (${albums.length})` },
    { v: 'track',  l: `Canciones (${tracks.length})` },
  ]

  const shown = filter === 'all' ? favorites : favorites.filter(f => f.itemType === filter)

  function handleClear() {
    if (window.confirm('¿Limpiar todos los favoritos?')) {
      clearFavorites()
      showToast('Favoritos eliminados')
    }
  }

  return (
    <div className="page-anim" style={{ minHeight: '100vh', paddingTop: 62 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px 64px' }}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.034em', marginBottom: 6 }}>
              Tus{' '}
              <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: 'var(--accent)', fontWeight: 400 }}>
                favoritos
              </em>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {favorites.length} elemento{favorites.length !== 1 ? 's' : ''} guardado{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          {favorites.length > 0 && (
            <button onClick={handleClear} style={{
              background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 8,
              padding: '8px 14px', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >Limpiar todo</button>
          )}
        </div>

        {/* Tabs */}
        {favorites.length > 0 && (
          <div style={{ display: 'flex', gap: 3, marginBottom: 24, background: 'var(--bg-elevated)', borderRadius: 11, padding: 4, width: 'fit-content', border: '1px solid var(--border-subtle)' }}>
            {tabs.map(({ v, l }) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                background: filter === v ? 'var(--accent)' : 'transparent', border: 'none',
                borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: filter === v ? 600 : 400,
                color: filter === v ? '#000' : 'var(--text-secondary)', cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>{l}</button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {favorites.length === 0 && (
          <EmptyState
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
            title="Aún no tienes favoritos"
            description="Explora música y guarda lo que más te guste presionando el ícono de corazón."
            action="Explorar música"
            onAction={() => navigate('/search')}
          />
        )}

        {shown.length > 0 && (
          <CardGrid>
            {shown.map((item, i) => {
              if (item.itemType === 'artist') return <ArtistCard key={item.id} artist={item} idx={i} />
              if (item.itemType === 'album')  return <AlbumCard  key={item.id} album={item}  idx={i} />
              if (item.itemType === 'track')  return <TrackCard  key={item.id} track={item}  idx={i} />
              return null
            })}
          </CardGrid>
        )}
      </div>
    </div>
  )
}
