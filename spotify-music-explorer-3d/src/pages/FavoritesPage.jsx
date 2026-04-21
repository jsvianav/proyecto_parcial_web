import FavoritesList from '../components/favorites/FavoritesList'

export default function FavoritesPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-white">
          Mis <span className="text-spotify-green">Favoritos</span>
        </h1>
        <p className="text-white/50 mt-2">Artistas, álbumes y canciones que guardaste.</p>
      </div>
      <FavoritesList />
    </div>
  )
}
