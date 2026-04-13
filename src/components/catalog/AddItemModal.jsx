import { useState } from 'react'
import { CATEGORIES } from '../../lib/categories'

export default function AddItemModal({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onAdd({ name, unit, price: price !== '' ? price : null, category: category || null })
      onClose()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <h2>Add item</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-fields">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Milk"
                autoFocus
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
              <div>
                <label className="label">Unit (optional)</label>
                <input
                  className="input"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="kg, pcs, L…"
                />
              </div>
              <div>
                <label className="label">Price (optional)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="label">Category (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)', marginBottom: 'var(--sp-2)' }}>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(category === c ? '' : c)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 99,
                      fontSize: 13,
                      border: `1.5px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
                      background: category === c ? 'var(--accent-dim)' : 'transparent',
                      color: category === c ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--t-fast)',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                className="input"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="or type custom…"
              />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
              {loading ? <span className="spinner" /> : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
