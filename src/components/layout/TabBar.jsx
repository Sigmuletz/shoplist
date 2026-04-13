const tabs = [
  {
    id: 'catalog',
    label: 'Catalog',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'list',
    label: 'List',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3.5" cy="6" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="3.5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="3.5" cy="18" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

export default function TabBar({ active, onChange, listCount, variant = 'bottom' }) {
  const isRail = variant === 'rail'

  return (
    <nav style={{
      display: 'flex',
      flexDirection: isRail ? 'column' : 'row',
      width: isRail ? 'var(--rail-w)' : '100%',
      height: isRail ? '100%' : 'auto',
      minHeight: isRail ? undefined : 'var(--tab-bar-h)',
      paddingBottom: isRail ? 'env(safe-area-inset-bottom)' : 'env(safe-area-inset-bottom)',
      paddingTop: isRail ? 'var(--sp-3)' : 0,
      borderTop: !isRail ? '1px solid var(--border)' : 'none',
      borderRight: isRail ? '1px solid var(--border)' : 'none',
      background: 'var(--bg-base)',
      flexShrink: 0,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: isRail ? 'none' : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            minHeight: 'var(--touch-min)',
            padding: isRail ? 'var(--sp-2) 0' : '6px 0',
            color: active === tab.id ? 'var(--accent)' : 'var(--text-muted)',
            position: 'relative',
            transition: 'color var(--t-fast)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            {tab.icon}
            {tab.id === 'list' && listCount > 0 && (
              <span className="badge" style={{
                position: 'absolute',
                top: -5,
                right: -8,
                fontSize: 10,
                minWidth: 16,
                height: 16,
              }}>
                {listCount > 99 ? '99+' : listCount}
              </span>
            )}
          </span>
          {!isRail && (
            <span style={{ fontSize: 10, fontWeight: 500, lineHeight: 1 }}>{tab.label}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
