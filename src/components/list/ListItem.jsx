import QuantityStepper from './QuantityStepper'

export default function ListItem({ item, onRemove, onUpdateQty }) {
  const linePrice = item.price != null ? item.price * item.quantity : null
  const priceStr = linePrice != null
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: item.currency || 'RON' }).format(linePrice)
    : null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sp-3)',
      padding: 'var(--sp-2) var(--sp-3)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.item_name}
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

      <QuantityStepper
        value={item.quantity}
        onChange={qty => onUpdateQty(item.id, qty)}
      />

      <button
        onClick={() => onRemove(item.id)}
        style={{
          minWidth: 30,
          minHeight: 30,
          borderRadius: 'var(--r-sm)',
          background: 'var(--danger-dim)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </button>
    </div>
  )
}
