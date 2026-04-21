export default function Pagination({ offset, limit, total, onPrev, onNext }) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const hasPrev = offset > 0
  const hasNext = offset + limit < total

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium disabled:opacity-30 hover:bg-white/20 transition-colors"
      >
        ← Anterior
      </button>
      <span className="text-spotify-gray text-sm">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium disabled:opacity-30 hover:bg-white/20 transition-colors"
      >
        Siguiente →
      </button>
    </div>
  )
}
