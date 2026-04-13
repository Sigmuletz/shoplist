import Header from '../layout/Header'
import ListItem from './ListItem'
import ListSummary from './ListSummary'
import SendButton from './SendButton'

export default function ListView({ listState, onGoToCatalog, telegramChatId }) {
  const { items, loading, removeItem, updateQty, markSent, list } = listState

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
          <SendButton
            items={items}
            listName={list?.name || 'Shopping List'}
            onSent={markSent}
            chatId={telegramChatId}
          />
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
            <button className="btn btn-primary" onClick={onGoToCatalog}>Browse catalog</button>
          </div>
        ) : (
          items.map(item => (
            <ListItem key={item.id} item={item} onRemove={removeItem} onUpdateQty={updateQty} />
          ))
        )}
      </div>
    </div>
  )
}
