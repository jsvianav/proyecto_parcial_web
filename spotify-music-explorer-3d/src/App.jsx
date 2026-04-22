import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import { PlayerProvider } from './context/PlayerContext'
import { usePlayer } from './context/PlayerContext'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'
import FavoritesPage from './pages/FavoritesPage'

function MiniPlayer() {
  const { currentTrack, stop } = usePlayer()
  if (!currentTrack) return null

  const imgSrc = currentTrack.imageUrl
    || currentTrack.album?.images?.[0]?.url
    || currentTrack.images?.[0]?.url

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(17,17,19,0.96)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', gap: 16, padding: '10px 24px',
      animation: 'slideDown 0.3s ease',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elevated)', flexShrink: 0 }}>
        {imgSrc && <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentTrack.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
          {currentTrack.artists?.map(a => a.name).join(', ')}
        </div>
      </div>
      {/* Waveform */}
      <div style={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', height: 20 }}>
        {[14,20,11,17,9].map((h, i) => (
          <div key={i} style={{
            width: 3, height: h, background: 'var(--accent)', borderRadius: 2,
            animation: `float ${0.6 + i * 0.13}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>
      <button onClick={stop} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
        padding: 6, display: 'flex', borderRadius: 6, transition: 'color 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

function AppInner() {
  const { currentTrack } = usePlayer()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ paddingBottom: currentTrack ? 72 : 0 }}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/search"      element={<SearchPage />} />
          <Route path="/artist/:id"  element={<DetailPage type="artist" />} />
          <Route path="/album/:id"   element={<DetailPage type="album" />} />
          <Route path="/track/:id"   element={<DetailPage type="track" />} />
          <Route path="/favorites"   element={<FavoritesPage />} />
        </Routes>
      </main>
      <MiniPlayer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <PlayerProvider>
          <AppInner />
        </PlayerProvider>
      </FavoritesProvider>
    </BrowserRouter>
  )
}
