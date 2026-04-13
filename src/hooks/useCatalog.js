import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCatalog(userId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('catalog_items')
      .select(`
        *,
        item_prices (price, currency)
      `)
      .eq('user_id', userId)
      .order('name')

    if (!error) {
      setItems(data.map(item => ({
        ...item,
        price: item.item_prices?.[0]?.price ?? null,
        currency: item.item_prices?.[0]?.currency ?? 'EUR',
      })))
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem({ name, unit, price, currency = 'EUR' }) {
    const { data: item, error } = await supabase
      .from('catalog_items')
      .insert({ user_id: userId, name: name.trim(), unit: unit?.trim() || null })
      .select()
      .single()

    if (error) throw error

    if (price != null && price !== '') {
      await supabase.from('item_prices').insert({
        user_id: userId,
        catalog_item_id: item.id,
        price: parseFloat(price),
        currency,
      })
    }

    await fetchItems()
    return item
  }

  async function deleteItem(id) {
    await supabase.from('catalog_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, addItem, deleteItem, refetch: fetchItems }
}
