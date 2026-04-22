export default function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--card-radius)', overflow: 'hidden',
    }}>
      <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 0 }} />
      <div style={{ padding: '11px 13px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div className="skeleton" style={{ height: 13, width: '78%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 11, width: '53%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 10, width: '38%', borderRadius: 6 }} />
      </div>
    </div>
  )
}
