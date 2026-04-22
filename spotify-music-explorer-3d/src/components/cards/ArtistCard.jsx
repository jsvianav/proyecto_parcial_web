import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'
import { showToast } from '../../utils/toast'

export default function ArtistCard({ artist, idx = 0 }) {
  const navigate = useNavigate()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [hov, setHov] = useState(false)
  const fav = isFavorite(artist.id)
  const imgSrc = artist.imageUrl || artist.images?.[0]?.url
    || `https://picsum.photos/seed/${encodeURIComponent(artist.name)}artist/300/300`

  function toggleFav(e) {
    e.stopPropagation()
    if (fav) {
      removeFavorite(artist.id)
      showToast('Eliminado de favoritos')
    } else {
      addFavorite({ ...artist, itemType: 'artist' })
      showToast('Agregado a favoritos ♥', 'success')
    }
  }

  return (
    <div
      className={`page-anim card-${Math.min(idx, 7)}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/artist/${artist.id}`)}
      style={{
        background: 'var(--bg-elevated)',
        border: `1px solid ${hov ? 'rgba(29,185,84,0.30)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--card-radius)', overflow: 'hidden', cursor: 'pointer', position: 'relative',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? '0 12px 36px rgba(0,0,0,0.45), 0 0 48px rgba(29,185,84,0.10)' : '0 1px 3px rgba(0,0,0,0.3)',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
        <img src={imgSrc} alt={artist.name} style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        {/* Play overlay */}
        <div style={{
          position: 'absolute', bottom: 10, right: 10, width: 36, height: 36, borderRadius: '50%',
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000',
          opacity: hov ? 1 : 0, transform: hov ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.8)',
          transition: 'all 0.25s', boxShadow: '0 4px 16px rgba(29,185,84,0.4)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      {/* Info */}
      <div style={{ padding: '11px 13px 13px' }}>
        <div style={{
          fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{artist.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
          {artist.followers?.total
            ? `${(artist.followers.total / 1e6).toFixed(1).replace('.0','') + 'M'} seguidores`
            : 'Artista'}
        </div>
        {artist.genres?.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {artist.genres.slice(0, 2).join(', ')}
          </div>
        )}
      </div>
      {/* Heart */}
      <button onClick={toggleFav} style={{
        position: 'absolute', top: 9, right: 9, width: 30, height: 30, borderRadius: '50%',
        background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hov || fav ? 1 : 0, transition: 'opacity 0.2s', backdropFilter: 'blur(4px)',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24"
          fill={fav ? 'var(--accent)' : 'none'}
          stroke={fav ? 'var(--accent)' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
  )
}
