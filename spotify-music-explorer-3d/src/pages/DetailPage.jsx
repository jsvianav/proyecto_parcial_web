import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArtist, getArtistTopTracks, getArtistAlbums, getAlbum, getTrack, searchSpotify } from '../services/spotifyAPI'
import { useFavorites } from '../context/FavoritesContext'
import { usePlayer } from '../context/PlayerContext'
import { showToast } from '../utils/toast'
import AlbumCard from '../components/cards/AlbumCard'
import CardGrid from '../components/ui/CardGrid'
import SecTitle from '../components/ui/SecTitle'
import SkeletonCard from '../components/ui/SkeletonCard'

function fmtMs(ms) {
  if (!ms) return '0:00'
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function fmtNum(n) {
  if (!n) return '—'
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}

function TrackRow({ track, index, fallbackImg }) {
  const { play, pause, currentTrack, isPlaying } = usePlayer()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [hov, setHov] = useState(false)
  const fav    = isFavorite(track.id)
  const active = currentTrack?.id === track.id && isPlaying

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '9px 12px', borderRadius: 8,
        background: hov ? 'var(--bg-elevated)' : 'transparent', transition: 'background 0.15s',
      }}>
      {/* Index / play button */}
      <div style={{ width: 22, textAlign: 'right', flexShrink: 0, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {hov
          ? <button onClick={() => { if (track.preview_url) { active ? pause() : play(track) } }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 0, display: 'flex' }}>
              {active
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              }
            </button>
          : <span style={{ fontSize: 13, color: active ? 'var(--accent)' : 'var(--text-tertiary)', fontWeight: active ? 600 : 400 }}>{index + 1}</span>
        }
      </div>
      {/* Album thumb */}
      <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        {(track.album?.images?.[0]?.url || fallbackImg) && (
          <img src={track.album?.images?.[track.album.images.length - 1]?.url || track.album?.images?.[0]?.url || fallbackImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      {/* Name + artist */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: active ? 600 : 400,
          color: active ? 'var(--accent)' : 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{track.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {track.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', flexShrink: 0 }}>{fmtMs(track.duration_ms)}</div>
      <button onClick={() => {
        if (fav) { removeFavorite(track.id); showToast('Eliminado de favoritos') }
        else { addFavorite({ ...track, itemType: 'track' }); showToast('Agregado a favoritos ♥', 'success') }
      }} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: fav ? 'var(--accent)' : 'var(--text-tertiary)',
        opacity: hov || fav ? 1 : 0, transition: 'opacity 0.15s', padding: 4, display: 'flex',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={fav ? 'var(--accent)' : 'none'}
          stroke={fav ? 'var(--accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
  )
}

export default function DetailPage({ type }) {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const { play, pause, currentTrack, isPlaying } = usePlayer()
  const [data, setData]     = useState(null)
  const [extras, setExtras] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [popW, setPopW]     = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(null); setData(null); setExtras(null); setPopW(0)

    async function load() {
      try {
        if (type === 'artist') {
          const artist = await getArtist(id)
          if (cancelled) return

          // Followers: client-credentials sometimes returns 0 — try search as fallback
          if (!(artist.followers?.total > 0) && artist.name) {
            try {
              const sr = await searchSpotify(artist.name, ['artist'], 0)
              const match = sr?.artists?.items?.find(a => a.id === id)
              if (match?.followers?.total > 0) {
                artist.followers = match.followers
                if (!artist.popularity && match.popularity) artist.popularity = match.popularity
                if (!artist.genres?.length && match.genres?.length) artist.genres = match.genres
              }
            } catch (_) {}
          }

          // Top tracks: try dedicated endpoint, fall back to search
          let topTracks = []
          try {
            const r = await getArtistTopTracks(id)
            topTracks = r.tracks || []
          } catch (_) {
            try {
              const r = await searchSpotify(`"${artist.name}"`, ['track'], 0)
              topTracks = (r?.tracks?.items || []).filter(t =>
                t.artists?.some(a => a.id === id)
              )
            } catch (_) {}
          }

          // Albums
          let albums = []
          try {
            const r = await getArtistAlbums(id)
            albums = r.items || []
          } catch (_) {}

          if (!cancelled) {
            setData(artist)
            setExtras({ topTracks: topTracks.slice(0, 10), albums })
          }
        } else if (type === 'album') {
          const album = await getAlbum(id)
          if (!cancelled) setData(album)
        } else {
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

  useEffect(() => {
    if (data) {
      const t = setTimeout(() => setPopW(data.popularity || 0), 350)
      return () => clearTimeout(t)
    }
  }, [data])

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 62 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px' }}>
        <div style={{ display: 'flex', gap: 44, flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ width: 240, height: 240, borderRadius: 'var(--card-radius)', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 44, width: '60%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 6 }} />
          </div>
        </div>
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 14 }}>
          {[0,1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', paddingTop: 62, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '32px 28px' }}>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</div>
        <button onClick={() => navigate(-1)} style={{
          background: 'var(--accent)', border: 'none', borderRadius: 20, padding: '9px 20px',
          fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer',
        }}>Volver</button>
      </div>
    </div>
  )

  if (!data) return null

  const img = data.images?.[0]?.url || data.album?.images?.[0]?.url
  const fav = isFavorite(data.id)
  const isCurrentPlaying = currentTrack?.id === data.id && isPlaying

  function toggleFav() {
    if (fav) { removeFavorite(data.id); showToast('Eliminado de favoritos') }
    else { addFavorite({ ...data, itemType: type }); showToast('Agregado a favoritos ♥', 'success') }
  }

  const tracks = type === 'artist'
    ? (extras?.topTracks?.slice(0, 10) || [])
    : (data.tracks?.items?.slice(0, 20) || [])

  return (
    <div className="page-anim" style={{ minHeight: '100vh', paddingTop: 62 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 28px 64px' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer', marginBottom: 32, padding: 0, transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver
        </button>

        {/* Hero row */}
        <div style={{ display: 'flex', gap: 44, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 52 }}>
          <div style={{ flexShrink: 0, width: 240, height: 240, borderRadius: type === 'artist' ? '50%' : 16, overflow: 'hidden', background: 'var(--bg-elevated)', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}>
            {img
              ? <img src={img} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
            }
          </div>

          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 10 }}>
              {type === 'artist' ? 'Artista' : type === 'album' ? 'Álbum' : 'Canción'}
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.032em', marginBottom: 16 }}>
              {data.name}
            </h1>

            {type === 'artist' && (
              <>
                <div style={{ display: 'flex', gap: 28, marginBottom: 14, flexWrap: 'wrap' }}>
                  {data.followers?.total > 0 && (
                    <Stat label="Oyentes mensuales" value={fmtNum(data.followers.total)} />
                  )}
                  {data.popularity > 0 && (
                    <Stat label="Popularidad" value={`${data.popularity} / 100`} />
                  )}
                </div>
                {data.popularity > 0 && <PopBar width={popW} />}
                {data.genres?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 16 }}>
                    {data.genres.slice(0, 5).map(g => <GenrePill key={g}>{g}</GenrePill>)}
                  </div>
                )}
              </>
            )}

            {type === 'album' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  {data.artists?.map(a => a.name).join(', ')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                  {data.release_date?.slice(0, 4)}{data.total_tracks ? ` · ${data.total_tracks} canciones` : ''}
                </div>
              </div>
            )}

            {type === 'track' && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  {data.artists?.map(a => a.name).join(', ')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 14 }}>
                  {fmtMs(data.duration_ms)}{data.popularity ? ` · Popularidad ${data.popularity}/100` : ''}
                </div>
                <PopBar width={popW} />
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 20 }}>
              {(type === 'track' || type === 'album') && data.preview_url && (
                <button onClick={() => { if (isCurrentPlaying) pause(); else play(data) }} style={{
                  background: 'var(--accent)', border: 'none', borderRadius: 24, padding: '9px 18px',
                  fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 0 18px var(--accent-glow)',
                }}>
                  {isCurrentPlaying
                    ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pausar</>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Preview</>
                  }
                </button>
              )}
              <button onClick={toggleFav} style={{
                background: fav ? 'rgba(29,185,84,0.10)' : 'var(--bg-elevated)',
                border: `1px solid ${fav ? 'var(--accent)' : 'var(--border-default)'}`,
                borderRadius: 24, padding: '9px 18px', fontSize: 13, fontWeight: 500,
                color: fav ? 'var(--accent)' : 'var(--text-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24"
                  fill={fav ? 'var(--accent)' : 'none'}
                  stroke={fav ? 'var(--accent)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {fav ? 'En favoritos' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>

        {/* Track list */}
        {tracks.length > 0 && (
          <section>
            <SecTitle>{type === 'artist' ? 'Top Canciones' : 'Canciones'}</SecTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} fallbackImg={type === 'album' ? img : undefined} />)}
            </div>
          </section>
        )}

        {/* Artist albums */}
        {type === 'artist' && extras?.albums?.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <SecTitle>Discografía</SecTitle>
            <CardGrid>
              {extras.albums.map((a, i) => <AlbumCard key={a.id} album={a} idx={i} />)}
            </CardGrid>
          </section>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function PopBar({ width }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: 4, height: 5, maxWidth: 280, overflow: 'hidden' }}>
      <div className="pop-bar" style={{
        height: '100%', width: `${width}%`,
        background: 'linear-gradient(90deg, var(--accent), #1ed760)', borderRadius: 4,
        transition: 'width 1.1s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  )
}

function GenrePill({ children }) {
  return (
    <span style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
      borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--text-secondary)',
    }}>{children}</span>
  )
}
