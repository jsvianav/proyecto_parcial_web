import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import VinylDisc from '../components/three/VinylDisc'
import SearchBar from '../components/search/SearchBar'
import ArtistCard from '../components/cards/ArtistCard'
import AlbumCard from '../components/cards/AlbumCard'
import GenreCard, { GENRES } from '../components/ui/GenreCard'
import CardGrid from '../components/ui/CardGrid'
import SecTitle from '../components/ui/SecTitle'

const FEAT_ARTISTS = [
  { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift',  followers:{total:85000000}, popularity:100, genres:['pop','country pop'],   imageUrl:'https://picsum.photos/seed/taylorswift/300/300' },
  { id: '4q3ewBCX7sLwd24euuV69X', name: 'Bad Bunny',     followers:{total:45000000}, popularity:97,  genres:['reggaeton','trap'],    imageUrl:'https://picsum.photos/seed/badbunnypr/300/300' },
  { id: '1Xyo4u8uXC1ZmMpatF05PJ', name: 'The Weeknd',    followers:{total:62000000}, popularity:96,  genres:['r&b','synth-pop'],    imageUrl:'https://picsum.photos/seed/theweekndxo/300/300' },
  { id: '6qqNVTkY8uBg9cP3Jd7DAH', name: 'Billie Eilish', followers:{total:58000000}, popularity:95,  genres:['art pop','dark pop'], imageUrl:'https://picsum.photos/seed/billieeilish2/300/300' },
]
const FEAT_ALBUMS = [
  { id: '151w1FgRZfnKZA9FEcg9Z3', name: 'Midnights',         artists:[{name:'Taylor Swift'}],  release_date:'2022-10-21', total_tracks:13, imageUrl:'https://picsum.photos/seed/midnights22/300/300' },
  { id: '3RQQmkQEvNCY4prGKE6oc5', name: 'Un Verano Sin Ti',  artists:[{name:'Bad Bunny'}],     release_date:'2022-05-06', total_tracks:23, imageUrl:'https://picsum.photos/seed/veranobunny1/300/300' },
  { id: '4yP0hdKOZPNshxUOjY0cZj', name: 'After Hours',       artists:[{name:'The Weeknd'}],    release_date:'2020-03-20', total_tracks:14, imageUrl:'https://picsum.photos/seed/afterhours99/300/300' },
  { id: '0JGOiO34nwfUdDrD612dOp', name: 'Happier Than Ever', artists:[{name:'Billie Eilish'}], release_date:'2021-07-30', total_tracks:16, imageUrl:'https://picsum.photos/seed/happierthan1/300/300' },
]

export default function HomePage() {
  const navigate  = useNavigate()
  const [recents] = useLocalStorage('spotify_recent_searches', [])
  const [q, setQ] = useState('')

  return (
    <div className="page-anim" style={{ minHeight: '100vh', paddingTop: 62 }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', top: '-10%', left: '38%', width: 700, height: 700, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(29,185,84,0.07) 0%, transparent 62%)',
        }} />
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '56px 28px 72px',
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40, flexWrap: 'wrap',
        }}>
          {/* Text block */}
          <div style={{ flex: '1 1 360px', minWidth: 280, position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--accent)',
              textTransform: 'uppercase', marginBottom: 18,
            }}>Spotify Music Explorer</div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)', fontWeight: 700,
              lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: 18,
            }}>
              Explora el universo<br/>de la{' '}
              <em style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: 'var(--accent)', fontWeight: 400 }}>
                música
              </em>
            </h1>

            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 440, lineHeight: 1.65, marginBottom: 28 }}>
              Descubre artistas, álbumes y canciones con una experiencia visual única en 3D. Powered by Spotify.
            </p>

            <div style={{ maxWidth: 500 }}>
              <SearchBar value={q} onChange={setQ}
                onSearch={v => { if (v.trim()) navigate(`/search?q=${encodeURIComponent(v.trim())}`) }} />
            </div>

            {recents.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Recientes:</span>
                {recents.map(r => (
                  <button key={r} onClick={() => navigate(`/search?q=${encodeURIComponent(r)}`)}
                    style={{
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                      borderRadius: 20, padding: '4px 11px', fontSize: 12, color: 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >{r}</button>
                ))}
              </div>
            )}

            <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <HeroBtn accent onClick={() => navigate('/search')}>Explorar música</HeroBtn>
              <HeroBtn onClick={() => navigate('/favorites')}>Mis favoritos</HeroBtn>
            </div>
          </div>

          {/* Vinyl */}
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 8px', zIndex: 1 }}>
            <VinylDisc size={380} spinning />
          </div>
        </div>
      </section>

      {/* ── Genres ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 48px' }}>
        <SecTitle>Géneros populares</SecTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {GENRES.map(g => <GenreCard key={g.id} genre={g} />)}
        </div>
      </section>

      {/* ── Featured artists ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 48px' }}>
        <SecTitle>Artistas destacados</SecTitle>
        <CardGrid>
          {FEAT_ARTISTS.map((a, i) => <ArtistCard key={a.id} artist={a} idx={i} />)}
        </CardGrid>
      </section>

      {/* ── Featured albums ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 72px' }}>
        <SecTitle>Álbumes destacados</SecTitle>
        <CardGrid>
          {FEAT_ALBUMS.map((a, i) => <AlbumCard key={a.id} album={a} idx={i} />)}
        </CardGrid>
      </section>
    </div>
  )
}

function HeroBtn({ children, onClick, accent }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: accent ? 'var(--accent)' : (hov ? 'var(--bg-elevated)' : 'transparent'),
        border: accent ? 'none' : '1px solid var(--border-strong)',
        borderRadius: 24, padding: '10px 20px', fontSize: 14, fontWeight: 600,
        color: accent ? '#000' : 'var(--text-primary)', cursor: 'pointer',
        boxShadow: accent ? '0 0 22px var(--accent-glow)' : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        filter: accent && hov ? 'brightness(1.08)' : 'none',
        transition: 'all 0.15s',
      }}>{children}</button>
  )
}
