import Header from '../layout/Header'
import HistoryEntry from './HistoryEntry'
import { useHistory } from '../../hooks/useHistory'

export default function HistoryView({ familyId, listState, onGoToList, chatId }) {
  const { history, loading, fetchItems } = useHistory(familyId)

  async function handleReuse(items) {
    for (const item of items) {
      await listState.addItem(item.catalog_item_id)
    }
    onGoToList()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="History" />

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No sent lists yet.</p>
          </div>
        ) : (
          history.map(entry => (
            <HistoryEntry
              key={entry.id}
              entry={entry}
              fetchItems={fetchItems}
              onReuse={handleReuse}
              chatId={chatId}
            />
          ))
        )}
      </div>
    </div>
  )
}
