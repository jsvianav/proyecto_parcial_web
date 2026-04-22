const TYPE_OPTS = [
  { v: 'all',    l: 'Todo' },
  { v: 'artist', l: 'Artistas' },
  { v: 'album',  l: 'Álbumes' },
  { v: 'track',  l: 'Canciones' },
]

export default function TypeFilter({ value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', background: 'var(--bg-elevated)', borderRadius: 11, padding: 4,
      border: '1px solid var(--border-subtle)', gap: 2,
    }}>
      {TYPE_OPTS.map(({ v, l }) => {
        const active = value === v
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            background: active ? 'var(--accent)' : 'transparent',
            border: 'none', borderRadius: 8, padding: '6px 13px', fontSize: 13,
            fontWeight: active ? 600 : 400,
            color: active ? '#000' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{l}</button>
        )
      })}
    </div>
  )
}
