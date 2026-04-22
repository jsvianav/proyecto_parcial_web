export default function EmptyState({ icon, title = 'Sin resultados', description, action, onAction }) {
  return (
    <div className="page-anim" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 20px', gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 4, color: 'var(--text-tertiary)',
        }}>{icon}</div>
      )}
      <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
          {description}
        </div>
      )}
      {action && onAction && (
        <button onClick={onAction} style={{
          marginTop: 8, background: 'var(--accent)', border: 'none',
          borderRadius: 20, padding: '9px 20px', fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer',
        }}>{action}</button>
      )}
    </div>
  )
}
