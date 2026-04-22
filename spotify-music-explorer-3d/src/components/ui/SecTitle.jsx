export default function SecTitle({ children, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 14 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.022em' }}>{children}</h2>
      {count !== undefined && (
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{count}</span>
      )}
    </div>
  )
}
