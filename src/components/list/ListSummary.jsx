export default function ListSummary({ items }) {
  const itemsWithPrice = items.filter(i => i.price != null)
  if (itemsWithPrice.length === 0) return null

  const total = itemsWithPrice.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const currency = itemsWithPrice[0]?.currency || 'RON'
  const totalStr = new Intl.NumberFormat('ro-RO', { style: 'currency', currency }).format(total)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        {items.length} item{items.length !== 1 ? 's' : ''}
      </span>
      <span style={{ fontWeight: 700, fontSize: 17 }}>{totalStr}</span>
    </div>
  )
}
