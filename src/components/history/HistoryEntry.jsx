import { useState } from 'react'
import { sendList } from '../../lib/telegram'

const dateFmt = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium' })

export default function HistoryEntry({ entry, fetchItems, onReuse, chatId }) {
  const [expanded, setExpanded] = useState(false)
  const [items, setItems] = useState(null)
  const [loadingItems, setLoadingItems] = useState(false)
  const [reusing, setReusing] = useState(false)
  const [sendState, setSendState] = useState('idle') // idle | loading | success | error
  const [sendError, setSendError] = useState(null)

  async function toggle() {
    if (!expanded && items === null) {
      setLoadingItems(true)
      try {
        const data = await fetchItems(entry.id)
        setItems(data)
      } finally {
        setLoadingItems(false)
      }
    }
    setExpanded(e => !e)
  }

  async function handleReuse() {
    if (!items) return
    setReusing(true)
    await onReuse(items)
    setReusing(false)
  }

  async function handleSend() {
    if (!items) return
    setSendState('loading')
    setSendError(null)
    try {
      await sendList(items, entry.name, chatId)
      setSendState('success')
      setTimeout(() => setSendState('idle'), 2500)
    } catch (err) {
      setSendError(err.message)
      setSendState('error')
    }
  }

  const total = items
    ? items.reduce((sum, i) => (i.price != null ? sum + i.price * i.quantity : sum), 0)
    : null
  const hasTotal = total !== null && items?.some(i => i.price != null)
  const totalStr = hasTotal
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: items.find(i => i.currency)?.currency || 'RON' }).format(total)
    : null

  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Header row */}
      <button
        onClick={toggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          padding: 'var(--sp-3) var(--sp-4)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>
            {dateFmt.format(new Date(entry.sent_at))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {entry.count} item{entry.count !== 1 ? 's' : ''}
            {totalStr && <span style={{ marginLeft: 8 }}>{totalStr}</span>}
          </div>
        </div>

        {loadingItems ? (
          <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
        ) : (
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              color: 'var(--text-muted)',
              transform: expanded ? 'rotate(90deg)' : 'none',
              transition: 'transform var(--t-fast)',
              flexShrink: 0,
            }}
          >
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        )}
      </button>

      {/* Expanded items */}
      {expanded && items && (
        <div style={{ paddingBottom: 'var(--sp-3)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '6px var(--sp-4)', fontSize: 13, color: 'var(--text-primary)' }}>
                    {item.item_name}
                    {item.unit && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 4 }}>/{item.unit}</span>
                    )}
                  </td>
                  <td style={{ padding: '6px var(--sp-3)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    ×{item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: 'var(--sp-3) var(--sp-4) 0', display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              className="btn btn-ghost"
              style={{ flex: 1, height: 38, fontSize: 14 }}
              onClick={handleReuse}
              disabled={reusing}
            >
              {reusing ? <span className="spinner" /> : 'Re-use'}
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, height: 38, fontSize: 14 }}
              onClick={handleSend}
              disabled={sendState !== 'idle'}
            >
              {sendState === 'loading' && <span className="spinner" />}
              {sendState === 'success' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {sendState === 'idle' && 'Send'}
              {sendState === 'error' && 'Send'}
            </button>
          </div>
          {sendState === 'error' && (
            <p style={{ color: 'var(--danger)', fontSize: 12, margin: 'var(--sp-2) var(--sp-4) 0' }}>
              {sendError || 'Failed to send.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
