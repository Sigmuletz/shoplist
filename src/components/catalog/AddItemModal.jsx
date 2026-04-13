import { useState } from 'react'

export default function AddItemModal({ onAdd, onClose, existingCategories = [] }) {
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [isStaple, setIsStaple] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await onAdd({ name, unit, price: price !== '' ? price : null, category: category.trim() || null, is_staple: isStaple })
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
              {existingCategories.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)', marginBottom: 'var(--sp-2)' }}>
                  <button type="button" onClick={() => setCategory('')} style={chipStyle(category === '')}>
                    None
                  </button>
                  {existingCategories.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(category === c ? '' : c)}
                      style={chipStyle(category === c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="input"
                list="add-cat-opts"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="None — or type a new category"
              />
              <datalist id="add-cat-opts">
                {existingCategories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                cursor: 'pointer', fontSize: 14,
              }}>
                <button
                  type="button"
                  onClick={() => setIsStaple(s => !s)}
                  style={{
                    width: 28, height: 28, borderRadius: 'var(--r-sm)',
                    background: isStaple ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    color: isStaple ? 'var(--accent)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, flexShrink: 0,
                  }}
                >
                  ★
                </button>
                <span style={{ color: isStaple ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  Staple item (always buy)
                </span>
              </label>
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

function chipStyle(active) {
  return {
    padding: '3px 10px',
    borderRadius: 99,
    fontSize: 13,
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-dim)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--t-fast)',
  }
}
