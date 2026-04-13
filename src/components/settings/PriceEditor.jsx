import { useState } from 'react'
import { usePrice } from '../../hooks/usePrice'

export default function PriceEditor({ items, userId, onRefetch }) {
  const { updatePrice } = usePrice(userId)
  const [values, setValues] = useState(() =>
    Object.fromEntries(items.map(i => [i.id, i.price ?? '']))
  )

  function handleChange(itemId, value) {
    setValues(prev => ({ ...prev, [itemId]: value }))
    updatePrice(itemId, value !== '' ? value : null)
  }

  if (items.length === 0) return (
    <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 'var(--sp-4) 0' }}>
      Add items to your catalog first.
    </p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map(item => (
        <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          padding: 'var(--sp-2) 0',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span style={{ flex: 1, fontSize: 15 }}>
            {item.name}
            {item.unit && <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 6 }}>/{item.unit}</span>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>€</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values[item.id] ?? ''}
              onChange={e => handleChange(item.id, e.target.value)}
              placeholder="—"
              style={{
                width: 80,
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                padding: '4px 8px',
                color: 'var(--text-primary)',
                fontSize: 14,
                textAlign: 'right',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
