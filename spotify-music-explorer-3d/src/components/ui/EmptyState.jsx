export default function EmptyState({ icon = '🔍', title = 'Sin resultados', description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-6xl">{icon}</span>
      <p className="text-white font-semibold text-xl">{title}</p>
      {description && <p className="text-spotify-gray text-sm max-w-sm">{description}</p>}
    </div>
  )
}
