import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'

export default function Header() {
  const navigate      = useNavigate()
  const location      = useLocation()
  const { favorites } = useFavorites()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ]               = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      setMenuOpen(false)
      setQ('')
    }
  }

  const nav = [
    { label: 'Inicio',    path: '/' },
    { label: 'Buscar',    path: '/search' },
    { label: 'Favoritos', path: '/favorites' },
  ]
  const favCount = favorites.length
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,11,0.88)' : 'rgba(10,10,11,0.55)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.3s',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 62,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        {/* Logo */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 17,
            letterSpacing: '-0.02em', color: 'var(--text-primary)', whiteSpace: 'nowrap',
          }}>Spotify Explorer</span>
        </button>

        {/* Nav — desktop */}
        <nav className="hide-mobile" style={{ display: 'flex', gap: 2, flex: 1, justifyContent: 'center' }}>
          {nav.map(({ label, path }) => {
            const active = isActive(path)
            return (
              <button key={path} onClick={() => navigate(path)} style={{
                position: 'relative', background: active ? 'rgba(255,255,255,0.07)' : 'none',
                border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s', letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                {label}
                {path === '/favorites' && favCount > 0 && (
                  <span style={{
                    marginLeft: 5, background: 'var(--accent)', color: '#000',
                    borderRadius: 20, padding: '1px 6px', fontSize: 10, fontWeight: 700,
                  }}>{favCount}</span>
                )}
                {active && (
                  <div style={{
                    position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                    width: 20, height: 2, background: 'var(--accent)', borderRadius: 1,
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Search — desktop */}
        <form onSubmit={handleSearch} className="hide-mobile" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)', pointerEvents: 'none',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Artistas, álbumes…"
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                borderRadius: 20, paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                fontSize: 13, color: 'var(--text-primary)', width: 190, outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>
          {q && (
            <button type="submit" style={{
              background: 'var(--accent)', border: 'none', cursor: 'pointer',
              borderRadius: 20, padding: '7px 15px', fontSize: 13, fontWeight: 600, color: '#000',
              boxShadow: '0 0 16px var(--accent-glow)',
            }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >Buscar</button>
          )}
        </form>

        {/* Hamburger — mobile */}
        <button className="show-mobile" onClick={() => setMenuOpen(o => !o)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-primary)', marginLeft: 'auto', padding: 4,
        }}>
          {menuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: 'rgba(10,10,11,0.97)', borderTop: '1px solid var(--border-subtle)',
          padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 6,
          animation: 'slideDown 0.2s ease',
        }}>
          {nav.map(({ label, path }) => (
            <button key={path} onClick={() => { navigate(path); setMenuOpen(false) }} style={{
              background: isActive(path) ? 'var(--bg-elevated)' : 'none',
              border: 'none', cursor: 'pointer', padding: '10px 12px', borderRadius: 8,
              textAlign: 'left', fontSize: 15,
              color: isActive(path) ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive(path) ? 600 : 400,
            }}>{label}</button>
          ))}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…" style={{
              flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
              borderRadius: 20, padding: '9px 14px', fontSize: 14, color: 'var(--text-primary)', outline: 'none',
            }} />
            <button type="submit" style={{
              background: 'var(--accent)', border: 'none', borderRadius: 20,
              padding: '9px 16px', fontWeight: 600, fontSize: 13, color: '#000', cursor: 'pointer',
            }}>Ir</button>
          </form>
        </div>
      )}
    </header>
  )
}
