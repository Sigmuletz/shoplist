import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useList(familyId) {
  const [list, setList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchActiveList = useCallback(async () => {
    if (!familyId) return
    setLoading(true)

    let { data: lists } = await supabase
      .from('shopping_lists')
      .select('id, name')
      .eq('family_id', familyId)
      .is('sent_at', null)
      .order('created_at', { ascending: false })
      .limit(1)

    let activeList = lists?.[0]

    if (!activeList) {
      const { data } = await supabase
        .from('shopping_lists')
        .insert({ family_id: familyId, name: 'Shopping List' })
        .select()
        .single()
      activeList = data
    }

    setList(activeList)
    await fetchItems(activeList.id)
    setLoading(false)
  }, [familyId])

  const fetchItems = async (listId) => {
    const { data } = await supabase
      .from('list_items_detail')
      .select('*')
      .eq('list_id', listId)
      .order('position', { ascending: false })

    setItems(data ?? [])
  }

  useEffect(() => {
    fetchActiveList()
  }, [fetchActiveList])

  async function addItem(catalogItemId) {
    if (!list) return

    const existing = items.find(i => i.catalog_item_id === catalogItemId)
    if (existing) {
      return updateQty(existing.id, existing.quantity + 1)
    }

    const { error } = await supabase.from('list_items').insert({
      list_id: list.id,
      catalog_item_id: catalogItemId,
      quantity: 1,
      position: items.length,
    })

    if (!error) await fetchItems(list.id)
  }

  async function removeItem(listItemId) {
    await supabase.from('list_items').delete().eq('id', listItemId)
    setItems(prev => prev.filter(i => i.id !== listItemId))
  }

  async function updateQty(listItemId, qty) {
    if (qty < 1) return removeItem(listItemId)
    await supabase.from('list_items').update({ quantity: qty }).eq('id', listItemId)
    setItems(prev => prev.map(i => i.id === listItemId ? { ...i, quantity: qty } : i))
  }

  async function markSent() {
    if (!list) return
    await supabase.from('shopping_lists').update({ sent_at: new Date().toISOString() }).eq('id', list.id)
    await fetchActiveList()
  }

  async function clearList() {
    if (!list) return
    await supabase.from('list_items').delete().eq('list_id', list.id)
    setItems([])
  }

  const isInList = (catalogItemId) => items.some(i => i.catalog_item_id === catalogItemId)

  return { list, items, loading, addItem, removeItem, updateQty, markSent, clearList, isInList }
}
