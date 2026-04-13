import { useState, useRef } from 'react'
import Header from '../layout/Header'
import SearchBar from './SearchBar'
import AddItemModal from './AddItemModal'
import BulkAddModal from './BulkAddModal'

export default function CatalogView({ catalog, listState }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [edits, setEdits] = useState({})
  const [saving, setSaving] = useState(false)
  const scrollRef = useRef(null)

  async function handleAdd(item) {
    await catalog.addItem(item)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function enterEdit() {
    const initial = {}
    catalog.items.forEach(i => {
      initial[i.id] = { name: i.name, unit: i.unit || '', price: i.price ?? '' }
    })
    setEdits(initial)
    setEditMode(true)
  }

  async function saveEdits() {
    setSaving(true)
    for (const item of catalog.items) {
      const e = edits[item.id]
      if (!e) continue
      const changed =
        e.name !== item.name ||
        e.unit !== (item.unit || '') ||
        String(e.price) !== String(item.price ?? '')
      if (changed && e.name.trim()) {
        await catalog.updateItem(item.id, { name: e.name, unit: e.unit, price: e.price !== '' ? e.price : null })
      }
    }
    setSaving(false)
    setEditMode(false)
    setEdits({})
  }

  function setField(id, field, value) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function handleDelete(id) {
    await catalog.deleteItem(id)
    setEdits(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const filtered = editMode
    ? catalog.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : catalog.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Catalog" />

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: 'var(--sp-2)',
        padding: 'var(--sp-3)',
        borderBottom: '1px solid var(--border)',
      }}>
        {editMode ? (
          <button
            className="btn btn-primary"
            style={{ flex: 1, height: 40, fontSize: 14 }}
            onClick={saveEdits}
            disabled={saving}
          >
            {saving ? <span className="spinner" /> : 'Done'}
          </button>
        ) : (
          <>
            <button className="btn btn-ghost" style={{ flex: 1, height: 40, fontSize: 14 }} onClick={() => setShowBulk(true)}>
              Bulk add
            </button>
            <button className="btn btn-ghost" style={{ flex: 1, height: 40, fontSize: 14 }} onClick={enterEdit}>
              Edit
            </button>
            <button className="btn btn-primary" style={{ flex: 1, height: 40, fontSize: 14 }} onClick={() => setShowAdd(true)}>
              + Add
            </button>
          </>
        )}
      </div>

      <div style={{ padding: 'var(--sp-2) var(--sp-3)', borderBottom: '1px solid var(--border)' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search items…" />
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {catalog.loading ? (
          <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            {search ? (
              <p>No items match "{search}"</p>
            ) : (
              <>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <p>Catalog empty.</p>
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <button className="btn btn-ghost" onClick={() => setShowBulk(true)}>Bulk add</button>
                  <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add item</button>
                </div>
              </>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Item</th>
                <th style={{ ...thStyle, width: 60, textAlign: 'center' }}>Unit</th>
                <th style={{ ...thStyle, width: 86, textAlign: 'right' }}>Price</th>
                <th style={{ ...thStyle, width: 36 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(item =>
                editMode ? (
                  <EditRow
                    key={item.id}
                    item={item}
                    values={edits[item.id] || { name: item.name, unit: item.unit || '', price: item.price ?? '' }}
                    onChange={(field, val) => setField(item.id, field, val)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ) : (
                  <ViewRow
                    key={item.id}
                    item={item}
                    inList={listState.isInList(item.id)}
                    onAdd={listState.addItem}
                  />
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <AddItemModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {showBulk && <BulkAddModal onAdd={handleAdd} onClose={() => setShowBulk(false)} />}
    </div>
  )
}

const thStyle = {
  padding: '6px var(--sp-3)',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  textAlign: 'left',
}

const cellInput = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)',
  padding: '3px 6px',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'inherit',
}

function ViewRow({ item, inList, onAdd }) {
  const priceStr = item.price != null
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: item.currency || 'RON' }).format(item.price)
    : '—'

  return (
    <tr style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: inList ? 'var(--accent-dim)' : 'transparent',
      transition: 'background var(--t-fast)',
    }}>
      <td style={{ padding: '7px var(--sp-3)', fontSize: 14, fontWeight: 500 }}>{item.name}</td>
      <td style={{ padding: '7px var(--sp-2)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>{item.unit || '—'}</td>
      <td style={{ padding: '7px var(--sp-3)', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'right' }}>{priceStr}</td>
      <td style={{ padding: '7px var(--sp-2) 7px var(--sp-1)' }}>
        <button
          onClick={() => onAdd(item.id)}
          style={{
            width: 28, height: 28, borderRadius: 'var(--r-sm)',
            background: inList ? 'var(--accent)' : 'var(--bg-elevated)',
            color: inList ? '#0a0a0a' : 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background var(--t-fast), color var(--t-fast)',
          }}
        >
          {inList ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )}
        </button>
      </td>
    </tr>
  )
}

function EditRow({ item, values, onChange, onDelete }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
      <td style={{ padding: '5px var(--sp-2) 5px var(--sp-3)' }}>
        <input
          style={cellInput}
          value={values.name}
          onChange={e => onChange('name', e.target.value)}
        />
      </td>
      <td style={{ padding: '5px var(--sp-1)' }}>
        <input
          style={{ ...cellInput, textAlign: 'center' }}
          value={values.unit}
          onChange={e => onChange('unit', e.target.value)}
          placeholder="—"
        />
      </td>
      <td style={{ padding: '5px var(--sp-1)' }}>
        <input
          style={{ ...cellInput, textAlign: 'right' }}
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={e => onChange('price', e.target.value)}
          placeholder="—"
        />
      </td>
      <td style={{ padding: '5px var(--sp-2) 5px var(--sp-1)' }}>
        <button
          onClick={onDelete}
          style={{
            width: 28, height: 28, borderRadius: 'var(--r-sm)',
            background: 'var(--danger-dim)', color: 'var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </td>
    </tr>
  )
}
