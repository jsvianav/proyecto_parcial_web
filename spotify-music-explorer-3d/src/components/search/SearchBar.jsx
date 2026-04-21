import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function SearchBar({ initialValue = '', autoFocus = false, onSearch }) {
  const [query, setQuery] = useState(initialValue)
  const [recents, setRecents] = useLocalStorage('spotify_recent_searches', [])
  const navigate = useNavigate()

  useEffect(() => {
    setQuery(initialValue)
  }, [initialValue])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setRecents((prev) => {
      const filtered = prev.filter((r) => r !== trimmed)
      return [trimmed, ...filtered].slice(0, 5)
    })

    if (onSearch) {
      onSearch(trimmed)
    } else {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artistas, álbumes, canciones..."
          autoFocus={autoFocus}
          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-spotify-green focus:ring-1 focus:ring-spotify-green transition-all"
        />
      </div>
      <button
        type="submit"
        className="bg-spotify-green text-black font-bold rounded-2xl px-6 py-3 hover:bg-green-400 transition-colors whitespace-nowrap"
      >
        Buscar
      </button>
    </form>
  )
}
