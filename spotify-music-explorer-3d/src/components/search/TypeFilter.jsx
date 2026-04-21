const TYPES = [
  { value: 'all', label: 'Todos' },
  { value: 'artist', label: 'Artistas' },
  { value: 'album', label: 'Álbumes' },
  { value: 'track', label: 'Canciones' },
]

export default function TypeFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TYPES.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            value === t.value
              ? 'bg-spotify-green text-black'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
