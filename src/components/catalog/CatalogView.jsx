import { useState, useRef } from 'react'
import Header from '../layout/Header'
import SearchBar from './SearchBar'
import AddItemModal from './AddItemModal'
import EditItemModal from './EditItemModal'
import BulkAddModal from './BulkAddModal'

export default function CatalogView({ catalog, listState }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showBulk, setShowBulk] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const scrollRef = useRef(null)

  async function handleAdd(item) {
    await catalog.addItem(item)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtered = catalog.items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Catalog" />

      {/* Action toolbar */}
      <div style={{
        display: 'flex',
        gap: 'var(--sp-2)',
        padding: 'var(--sp-3)',
        borderBottom: '1px solid var(--border)',
      }}>
        <button
          className="btn btn-ghost"
          style={{ flex: 1, height: 40, fontSize: 14 }}
          onClick={() => setShowBulk(true)}
        >
          Bulk add
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 1, height: 40, fontSize: 14 }}
          onClick={() => setShowAdd(true)}
        >
          + Add item
        </button>
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
                <th style={{ ...thStyle, width: 52, textAlign: 'center' }}>Unit</th>
                <th style={{ ...thStyle, width: 80, textAlign: 'right' }}>Price</th>
                <th style={{ ...thStyle, width: 34 }} />
                <th style={{ ...thStyle, width: 34 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <CatalogRow
                  key={item.id}
                  item={item}
                  inList={listState.isInList(item.id)}
                  onAdd={listState.addItem}
                  onEdit={setEditItem}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && <AddItemModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {showBulk && <BulkAddModal onAdd={handleAdd} onClose={() => setShowBulk(false)} />}
      {editItem && (
        <EditItemModal
          item={editItem}
          onSave={catalog.updateItem}
          onDelete={catalog.deleteItem}
          onClose={() => setEditItem(null)}
        />
      )}
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

function CatalogRow({ item, inList, onAdd, onEdit }) {
  const priceStr = item.price != null
    ? new Intl.NumberFormat('ro-RO', { style: 'currency', currency: item.currency || 'RON' }).format(item.price)
    : '—'

  return (
    <tr style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: inList ? 'var(--accent-dim)' : 'transparent',
      transition: 'background var(--t-fast)',
    }}>
      <td style={{ padding: '7px var(--sp-3)', fontSize: 14, fontWeight: 500 }}>
        {item.name}
      </td>
      <td style={{ padding: '7px var(--sp-2)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
        {item.unit || '—'}
      </td>
      <td style={{ padding: '7px var(--sp-3)', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'right' }}>
        {priceStr}
      </td>
      <td style={{ padding: '7px var(--sp-1)' }}>
        <button
          onClick={() => onEdit(item)}
          style={{
            width: 28, height: 28,
            borderRadius: 'var(--r-sm)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </td>
      <td style={{ padding: '7px var(--sp-2) 7px var(--sp-1)' }}>
        <button
          onClick={() => onAdd(item.id)}
          style={{
            width: 28, height: 28,
            borderRadius: 'var(--r-sm)',
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
