export default function Header({ title, action }) {
  return (
    <header style={{
      height: 'var(--header-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--sp-4)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-base)',
      flexShrink: 0,
    }}>
      <h1 style={{ fontSize: 17, fontWeight: 600 }}>{title}</h1>
      {action && <div>{action}</div>}
    </header>
  )
}
