import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useHistory(familyId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    if (!familyId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('id, name, sent_at, created_at, list_items(count)')
      .not('sent_at', 'is', null)
      .eq('family_id', familyId)
      .order('sent_at', { ascending: false })

    if (!error) {
      setHistory(data.map(row => ({
        id: row.id,
        name: row.name,
        sent_at: row.sent_at,
        created_at: row.created_at,
        count: row.list_items?.[0]?.count ?? 0,
      })))
    }
    setLoading(false)
  }, [familyId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  async function fetchItems(listId) {
    const { data, error } = await supabase
      .from('list_items_detail')
      .select('*')
      .eq('list_id', listId)
      .order('position', { ascending: false })
    if (error) throw error
    return data
  }

  return { history, loading, fetchItems }
}
