import { supabase } from './supabase'
import { formatList } from './formatList'

export async function sendList(items, listName, chatId) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const message = formatList(items, listName)

  const res = await fetch('/api/send-telegram', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ message, chat_id: chatId }),
  })

  const json = await res.json()
  if (!json.ok) throw new Error(json.error || 'Telegram send failed')
  return json
}
