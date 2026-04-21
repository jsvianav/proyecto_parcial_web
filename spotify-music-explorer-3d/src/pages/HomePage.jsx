import { Link, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import SearchBar from '../components/search/SearchBar'
import VinylScene from '../components/three/VinylScene'

export default function HomePage() {
  const [recents] = useLocalStorage('spotify_recent_searches', [])
  const navigate = useNavigate()

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative flex flex-col lg:flex-row items-center gap-8 px-4 py-16 max-w-7xl mx-auto">
        {/* Text side */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
            Explora la{' '}
            <span className="text-spotify-green">música</span>{' '}
            en 3D
          </h1>
          <p className="mt-4 text-white/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
            Descubre artistas, álbumes y canciones con una experiencia visual única. Powered by Spotify.
          </p>
          <div className="mt-8 max-w-lg mx-auto lg:mx-0">
            <SearchBar />
          </div>

          {recents.length > 0 && (
            <div className="mt-6">
              <p className="text-white/40 text-sm mb-2">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {recents.map((r) => (
                  <button
                    key={r}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(r)}`)}
                    className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm hover:bg-white/20 hover:text-white transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center lg:justify-start">
            <Link
              to="/search"
              className="bg-spotify-green text-black font-bold rounded-full px-6 py-3 hover:bg-green-400 transition-colors"
            >
              Explorar música
            </Link>
            <Link
              to="/favorites"
              className="border border-white/30 text-white font-bold rounded-full px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Mis favoritos
            </Link>
          </div>
        </div>

        {/* 3D Vinyl side */}
        <div className="flex-1 w-full h-64 lg:h-[500px] relative">
          <VinylScene showSparkles />
        </div>
      </section>

      {/* Features section */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🎤', title: 'Artistas', desc: 'Explora perfiles, top tracks y discografía completa.' },
          { icon: '💿', title: 'Álbumes', desc: 'Portadas en 3D, tracklist y detalles del álbum.' },
          { icon: '🎵', title: 'Canciones', desc: 'Escucha previews de 30s directamente en la app.' },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-spotify-green/40 transition-colors"
          >
            <span className="text-4xl">{icon}</span>
            <h3 className="text-white font-bold text-xl mt-3">{title}</h3>
            <p className="text-white/50 mt-2 text-sm">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
