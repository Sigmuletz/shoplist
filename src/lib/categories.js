export const CATEGORIES = ['Meat', 'Grains', 'Vegetables', 'Fruits', 'Dairy', 'Pantry', 'Beverages']

export function groupByCategory(items) {
  const groups = {}
  items.forEach(item => {
    const cat = item.category?.trim() || 'Other'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => {
      if (a === 'Other') return 1
      if (b === 'Other') return -1
      const ai = CATEGORIES.indexOf(a)
      const bi = CATEGORIES.indexOf(b)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })
    .map(([key, items]) => ({ key, items: [...items].sort((a, b) => (a.name || a.item_name).localeCompare(b.name || b.item_name)) }))
}
