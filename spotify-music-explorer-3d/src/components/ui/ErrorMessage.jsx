export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-5xl">⚠️</span>
      <p className="text-white font-semibold text-lg">Algo salió mal</p>
      <p className="text-spotify-gray text-sm max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 bg-spotify-green text-black font-bold rounded-full px-6 py-2 hover:bg-green-400 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
