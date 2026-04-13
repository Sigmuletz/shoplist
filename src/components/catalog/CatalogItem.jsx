export default function CatalogItem({ item, inList, onAdd, onEdit }) {
  const priceStr = item.price != null
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: item.currency || 'RON' }).format(item.price)
    : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sp-2)',
      padding: 'var(--sp-2) var(--sp-3)',
      borderBottom: '1px solid var(--border-subtle)',
      background: inList ? 'var(--accent-dim)' : 'transparent',
      transition: 'background var(--t-fast)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>
          {item.name}
          {item.unit && <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 5, fontSize: 12 }}>/{item.unit}</span>}
        </div>
        {priceStr && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{priceStr}</div>}
      </div>

      <button
        onClick={() => onEdit(item)}
        style={{
          width: 30, height: 30,
          borderRadius: 'var(--r-sm)',
          background: 'var(--bg-elevated)',
          color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>

      <button
        onClick={() => onAdd(item.id)}
        style={{
          width: 30, height: 30,
          borderRadius: 'var(--r-sm)',
          background: inList ? 'var(--accent)' : 'var(--bg-elevated)',
          color: inList ? '#0a0a0a' : 'var(--text-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--t-fast), color var(--t-fast)',
          flexShrink: 0,
        }}
      >
        {inList ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        )}
      </button>
    </div>
  )
}
