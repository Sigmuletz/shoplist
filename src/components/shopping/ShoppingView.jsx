import { useState } from 'react'
import Header from '../layout/Header'
import { UserAvatar } from '../settings/SettingsView'
import { useShoppingSession } from '../../hooks/useShoppingSession'
import { groupByCategory } from '../../lib/categories'

const dateFmt = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'medium', timeStyle: 'short' })

export default function ShoppingView({ familyId, profile }) {
  const { list, items, loading, refresh, toggleChecked, resetChecked } = useShoppingSession(familyId, profile?.id)
  const [sortBy, setSortBy] = useState('name')

  const checked = items.filter(i => i.checked).length
  const total = items.length

  const groups = sortBy === 'category'
    ? groupByCategory(items)
    : [{ key: null, items: [...items].sort((a, b) => a.item_name.localeCompare(b.item_name)) }]

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
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {dateFmt.format(new Date(list.sent_at))} · {checked}/{total}
            </span>
            {checked > 0 && (
              <button onClick={resetChecked} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
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

          {/* Table */}
          <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ ...thBase, width: 32 }} />
                  <Th label="Item" col="name" sortBy={sortBy} onSort={setSortBy} />
                  <Th label="Category" col="category" sortBy={sortBy} onSort={setSortBy} style={{ width: 88 }} />
                  <th style={{ ...thBase, width: 36, textAlign: 'right' }}>Qty</th>
                  <th style={{ ...thBase, width: 30 }} />
                </tr>
              </thead>
              <tbody>
                {groups.map(({ key, items: groupItems }) => (
                  <>
                    {key && (
                      <tr key={`hdr-${key}`}>
                        <td colSpan={5} style={categoryHeaderStyle}>{key}</td>
                      </tr>
                    )}
                    {groupItems.map(item => (
                      <tr
                        key={item.id}
                        onClick={() => toggleChecked(item.id, item.checked, profile?.icon)}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: item.checked ? 'var(--bg-elevated)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background var(--t-fast)',
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: '8px 0 8px var(--sp-3)', width: 32 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 5,
                            border: `2px solid ${item.checked ? 'var(--accent)' : 'var(--border)'}`,
                            background: item.checked ? 'var(--accent)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all var(--t-fast)',
                          }}>
                            {item.checked && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </div>
                        </td>

                        {/* Name + unit */}
                        <td style={{ padding: '8px var(--sp-2)' }}>
                          <span style={{
                            fontSize: 14, fontWeight: 500,
                            color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: item.checked ? 'line-through' : 'none',
                            transition: 'color var(--t-fast)',
                          }}>
                            {item.item_name}
                          </span>
                          {item.unit && (
                            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>/{item.unit}</span>
                          )}
                          {item.note && (
                            <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 1 }}>{item.note}</span>
                          )}
                        </td>

                        {/* Category */}
                        <td style={{ padding: '8px var(--sp-2)', fontSize: 12, color: 'var(--text-muted)' }}>
                          {item.category || '—'}
                        </td>

                        {/* Qty */}
                        <td style={{ padding: '8px var(--sp-2)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'right' }}>
                          ×{item.quantity}
                        </td>

                        {/* Checker avatar */}
                        <td style={{ padding: '8px var(--sp-2) 8px var(--sp-1)', width: 30 }}>
                          {item.checked && (
                            <UserAvatar icon={item.checked_by_icon} email="" size={22} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function Th({ label, col, sortBy, onSort, style }) {
  const active = sortBy === col
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        ...thBase,
        cursor: 'pointer',
        userSelect: 'none',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        ...style,
      }}
    >
      {label}
      <span style={{ marginLeft: 3, opacity: active ? 1 : 0 }}>▾</span>
    </th>
  )
}

const thBase = {
  padding: '6px var(--sp-2) 6px var(--sp-3)',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  textAlign: 'left',
}

const categoryHeaderStyle = {
  padding: '5px var(--sp-3) 4px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  background: 'var(--bg-elevated)',
  borderBottom: '1px solid var(--border)',
}
