export function groupByCategory(items) {
  const groups = {}
  items.forEach(item => {
    const cat = item.category?.trim() || 'None'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === 'None') return 1
      if (b === 'None') return -1
      return a.localeCompare(b)
    })
    .map(([key, items]) => ({ key, items: [...items].sort((a, b) => (a.name || a.item_name).localeCompare(b.name || b.item_name)) }))
}
