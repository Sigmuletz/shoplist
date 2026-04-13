import { useState } from 'react'

export default function EditItemModal({ item, onSave, onDelete, onClose }) {
  const [name, setName] = useState(item.name)
  const [unit, setUnit] = useState(item.unit || '')
  const [price, setPrice] = useState(item.price ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onSave(item.id, { name, unit, price: price !== '' ? price : null })
      onClose()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    await onDelete(item.id)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <h2>Edit item</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-fields">
            <div>
              <label className="label">Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} autoFocus required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
              <div>
                <label className="label">Unit</label>
                <input className="input" value={unit} onChange={e => setUnit(e.target.value)} placeholder="kg, pcs…" />
              </div>
              <div>
                <label className="label">Price (RON)</label>
                <input className="input" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading} style={{ flex: '0 0 auto', padding: '0 var(--sp-3)' }}>
              Delete
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
              {loading ? <span className="spinner" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
