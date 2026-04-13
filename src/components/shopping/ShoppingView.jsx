import Header from '../layout/Header'
import { UserAvatar } from '../settings/SettingsView'
import { useShoppingSession } from '../../hooks/useShoppingSession'

const dateFmt = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium', timeStyle: 'short' })

export default function ShoppingView({ familyId, profile }) {
  const { list, items, loading, refresh, toggleChecked, resetChecked } = useShoppingSession(familyId, profile?.id)

  const checked = items.filter(i => i.checked).length
  const total = items.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Active list"
        action={
          <button
            onClick={refresh}
            style={{
              width: 34, height: 34,
              borderRadius: 'var(--r-sm)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
        }
      />

      {loading ? (
        <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>
      ) : !list ? (
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>No sent list yet.</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Send a list to start shopping.</p>
        </div>
      ) : (
        <>
          {/* Meta bar */}
          <div style={{
            padding: 'var(--sp-2) var(--sp-4)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {dateFmt.format(new Date(list.sent_at))}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 12 }}>
                {checked}/{total} done
              </span>
            </div>
            {checked > 0 && (
              <button
                onClick={resetChecked}
                style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border-subtle)' }}>
            <div style={{
              height: '100%',
              width: total > 0 ? `${(checked / total) * 100}%` : '0%',
              background: 'var(--accent)',
              transition: 'width var(--t-fast)',
            }} />
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => toggleChecked(item.id, item.checked, profile?.icon)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-3) var(--sp-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: item.checked ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background var(--t-fast)',
                }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 22, height: 22,
                  borderRadius: 6,
                  border: `2px solid ${item.checked ? 'var(--accent)' : 'var(--border)'}`,
                  background: item.checked ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--t-fast)',
                }}>
                  {item.checked && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>

                {/* Name + unit */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: item.checked ? 'line-through' : 'none',
                    transition: 'color var(--t-fast)',
                  }}>
                    {item.item_name}
                  </span>
                  {item.unit && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 5 }}>
                      /{item.unit}
                    </span>
                  )}
                </div>

                {/* Quantity + checker icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>×{item.quantity}</span>
                  {item.checked && (
                    <UserAvatar icon={item.checked_by_icon} email="" size={24} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
