import { useState } from 'react'
import Header from '../layout/Header'
import ListItem from './ListItem'
import ListSummary from './ListSummary'
import SendButton from './SendButton'

function SaveButton({ onSave }) {
  const [state, setState] = useState('idle')

  async function handle() {
    setState('loading')
    await onSave()
    setState('success')
    setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button
      className="btn btn-ghost"
      style={{ height: 42, padding: '0 var(--sp-3)', fontSize: 14, flexShrink: 0 }}
      onClick={handle}
      disabled={state !== 'idle'}
    >
      {state === 'loading' && <span className="spinner" />}
      {state === 'success' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {state === 'idle' && 'Save'}
    </button>
  )
}

export default function ListView({ listState, catalog, onGoToCatalog, telegramChatId }) {
  const { items, loading, removeItem, updateQty, markSent, updateNote, addStaples, list } = listState

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title={list?.name || 'Shopping List'} />

      {items.length > 0 && (
        <div style={{
          padding: 'var(--sp-3) var(--sp-3) var(--sp-2)',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-2)',
        }}>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            {catalog && catalog.items.some(i => i.is_staple) && (
              <button
                className="btn btn-ghost"
                style={{ height: 42, padding: '0 var(--sp-3)', fontSize: 14, flexShrink: 0 }}
                onClick={() => addStaples(catalog.items)}
                title="Add staple items"
              >
                ★
              </button>
            )}
            <SendButton
              items={items}
              listName={list?.name || 'Shopping List'}
              onSent={markSent}
              chatId={telegramChatId}
            />
            <SaveButton onSave={markSent} />
          </div>
          <ListSummary items={items} />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div className="empty-state"><p>Loading…</p></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            <p>List is empty.</p>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {catalog && catalog.items.some(i => i.is_staple) && (
                <button className="btn btn-ghost" onClick={() => addStaples(catalog.items)}>★ Staples</button>
              )}
              <button className="btn btn-primary" onClick={onGoToCatalog}>Browse catalog</button>
            </div>
          </div>
        ) : (
          items.map(item => (
            <ListItem key={item.id} item={item} onRemove={removeItem} onUpdateQty={updateQty} onUpdateNote={updateNote} />
          ))
        )}
      </div>
    </div>
  )
}
