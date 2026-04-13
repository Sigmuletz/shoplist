/**
 * Format list items into a Telegram Markdown message.
 * @param {Array} items - list_items_detail rows
 * @param {string} listName
 * @returns {string}
 */
export function formatList(items, listName = 'Shopping List') {
  if (!items.length) return `*${listName}*\n\n_(empty)_`

  let total = 0
  let hasPrice = false

  const lines = items.map((item) => {
    const qty = item.quantity > 1 ? ` ×${item.quantity}` : ''
    const unit = item.unit ? ` ${item.unit}` : ''
    let priceStr = ''

    if (item.price != null) {
      const linePrice = item.price * item.quantity
      total += linePrice
      hasPrice = true
      priceStr = ` — ${formatCurrency(linePrice, item.currency)}`
    }

    return `• ${item.item_name}${unit}${qty}${priceStr}`
  })

  let msg = `*${listName}*\n\n${lines.join('\n')}`

  if (hasPrice) {
    msg += `\n\n*Total: ${formatCurrency(total, items[0].currency)}*`
  }

  return msg
}

function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
