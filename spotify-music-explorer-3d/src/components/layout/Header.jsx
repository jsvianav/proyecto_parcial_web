import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setMenuOpen(false)
    }
  }

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-spotify-green font-semibold'
      : 'text-white/80 hover:text-spotify-green transition-colors'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-spotify-green font-bold text-xl">
          <span className="text-2xl">🎵</span>
          <span className="hidden sm:block">Music Explorer 3D</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/search" className={linkClass}>Buscar</NavLink>
          <NavLink to="/favorites" className={linkClass}>Favoritos</NavLink>
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar artistas, álbumes..."
            className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-spotify-green w-56"
          />
          <button
            type="submit"
            className="bg-spotify-green text-black font-semibold rounded-full px-4 py-1.5 text-sm hover:bg-green-400 transition-colors"
          >
            Buscar
          </button>
        </form>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/search" className={linkClass} onClick={() => setMenuOpen(false)}>Buscar</NavLink>
          <NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}>Favoritos</NavLink>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-spotify-green"
            />
            <button type="submit" className="bg-spotify-green text-black rounded-full px-4 py-2 text-sm font-semibold">
              Ir
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
