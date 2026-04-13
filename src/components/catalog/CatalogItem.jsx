export default function CatalogItem({ item, inList, onAdd }) {
  const priceStr = item.price != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currency || 'EUR' }).format(item.price)
    : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sp-3)',
      padding: 'var(--sp-3) var(--sp-4)',
      borderBottom: '1px solid var(--border-subtle)',
      background: inList ? 'var(--accent-dim)' : 'transparent',
      transition: 'background var(--t-fast)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.name}
          {item.unit && (
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 6, fontSize: 13 }}>
              /{item.unit}
            </span>
          )}
        </div>
        {priceStr && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {priceStr}
          </div>
        )}
      </div>

      <button
        onClick={() => onAdd(item.id)}
        style={{
          minWidth: 36,
          minHeight: 36,
          borderRadius: 'var(--r-sm)',
          background: inList ? 'var(--accent)' : 'var(--bg-elevated)',
          color: inList ? '#0a0a0a' : 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--t-fast), color var(--t-fast)',
          flexShrink: 0,
        }}
      >
        {inList ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        )}
      </button>
    </div>
  )
}
