import { useState } from 'react'

export default function BulkAddModal({ onAdd, onClose }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    setLoading(true)
    setError(null)
    try {
      for (const line of lines) {
        await onAdd({ name: line })
      }
      onClose()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const count = text.split('\n').map(l => l.trim()).filter(Boolean).length

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <h2>Bulk add</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-fields">
            <div>
              <label className="label">One item per line</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={"Milk\nBread\nEggs\nButter"}
                autoFocus
                rows={8}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--sp-3) var(--sp-4)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              {count > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
                  {count} item{count !== 1 ? 's' : ''} to add
                </p>
              )}
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || count === 0}>
              {loading ? <span className="spinner" /> : `Add ${count || ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
