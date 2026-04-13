import { useState } from 'react'
import QuantityStepper from './QuantityStepper'

export default function ListItem({ item, onRemove, onUpdateQty, onUpdateNote }) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState(item.note || '')

  const linePrice = item.price != null ? item.price * item.quantity : null
  const priceStr = linePrice != null
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: item.currency || 'RON' }).format(linePrice)
    : null

  function handleNoteBlur() {
    onUpdateNote(item.id, noteText)
    if (!noteText.trim()) setNoteOpen(false)
  }

  return (
    <div style={{
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-2) var(--sp-3)',
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
          {!noteOpen && item.note && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic' }}>
              {item.note}
            </div>
          )}
        </div>

        {/* Note toggle */}
        <button
          onClick={() => { setNoteOpen(o => !o); if (!noteOpen) setNoteText(item.note || '') }}
          style={{
            width: 28, height: 28,
            borderRadius: 'var(--r-sm)',
            background: (noteOpen || item.note) ? 'var(--accent-dim)' : 'var(--bg-elevated)',
            color: (noteOpen || item.note) ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Add note"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

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

      {noteOpen && (
        <div style={{ padding: '0 var(--sp-3) var(--sp-2)' }}>
          <input
            autoFocus
            className="input"
            style={{ fontSize: 13 }}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            onBlur={handleNoteBlur}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            placeholder="Add a note…"
          />
        </div>
      )}
    </div>
  )
}
