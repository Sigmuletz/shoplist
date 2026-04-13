import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useShoppingSession(familyId, userId) {
  const [list, setList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!familyId) return
    setLoading(true)

    // Most recent sent list
    const { data: lists } = await supabase
      .from('shopping_lists')
      .select('id, name, sent_at')
      .eq('family_id', familyId)
      .not('sent_at', 'is', null)
      .order('sent_at', { ascending: false })
      .limit(1)

    const activeList = lists?.[0] ?? null
    setList(activeList)

    if (activeList) {
      const { data } = await supabase
        .from('list_items_detail')
        .select('*')
        .eq('list_id', activeList.id)
        .order('position', { ascending: false })
      setItems(data ?? [])
    } else {
      setItems([])
    }

    setLoading(false)
  }, [familyId])

  useEffect(() => { fetch() }, [fetch])

  async function toggleChecked(listItemId, currentChecked, checkerIcon) {
    const next = !currentChecked
    setItems(prev => prev.map(i => i.id === listItemId
      ? { ...i, checked: next, checked_by: next ? userId : null, checked_by_icon: next ? checkerIcon : null }
      : i
    ))
    await supabase.from('list_items')
      .update({ checked: next, checked_by: next ? userId : null })
      .eq('id', listItemId)
  }

  async function resetChecked() {
    if (!list) return
    await supabase.from('list_items').update({ checked: false }).eq('list_id', list.id)
    setItems(prev => prev.map(i => ({ ...i, checked: false })))
  }

  return { list, items, loading, refresh: fetch, toggleChecked, resetChecked }
}
