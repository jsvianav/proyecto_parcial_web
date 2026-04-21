export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 border-4 border-white/20 border-t-spotify-green rounded-full animate-spin" />
      <p className="text-spotify-gray text-sm">{message}</p>
    </div>
  )
}
