import { useState, useRef } from 'react'
import Header from '../layout/Header'
import SearchBar from './SearchBar'
import CatalogItem from './CatalogItem'
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
      <Header
        title="Catalog"
        action={
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button className="btn btn-ghost" style={{ minHeight: 32, padding: '0 var(--sp-2)', fontSize: 12 }} onClick={() => setShowBulk(true)}>
              Bulk
            </button>
            <button className="btn btn-primary" style={{ minHeight: 32, padding: '0 var(--sp-3)', fontSize: 12 }} onClick={() => setShowAdd(true)}>
              + Add
            </button>
          </div>
        }
      />

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
          filtered.map(item => (
            <CatalogItem
              key={item.id}
              item={item}
              inList={listState.isInList(item.id)}
              onAdd={listState.addItem}
              onEdit={setEditItem}
            />
          ))
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
