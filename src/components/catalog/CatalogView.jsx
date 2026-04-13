import { useState } from 'react'
import Header from '../layout/Header'
import SearchBar from './SearchBar'
import CatalogItem from './CatalogItem'
import AddItemModal from './AddItemModal'

export default function CatalogView({ catalog, listState }) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = catalog.items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Catalog"
        action={
          <button
            className="btn btn-primary"
            style={{ minHeight: 34, padding: '0 var(--sp-3)', fontSize: 13 }}
            onClick={() => setShowModal(true)}
          >
            + Add
          </button>
        }
      />

      <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search items…" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {catalog.loading ? (
          <div className="empty-state">
            <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            {search ? (
              <p>No items match "{search}"</p>
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <p>Your catalog is empty.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add first item</button>
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
            />
          ))
        )}
      </div>

      {showModal && (
        <AddItemModal
          onAdd={catalog.addItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
