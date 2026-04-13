export default function ListSummary({ items }) {
  const itemsWithPrice = items.filter(i => i.price != null)
  if (itemsWithPrice.length === 0) return null

  const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const currency = itemsWithPrice[0]?.currency || 'EUR'
  const totalStr = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(total)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--sp-3) 0',
      borderTop: '1px solid var(--border)',
      marginTop: 'var(--sp-2)',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        {items.length} item{items.length !== 1 ? 's' : ''}
      </span>
      <span style={{ fontWeight: 700, fontSize: 17 }}>{totalStr}</span>
    </div>
  )
}
