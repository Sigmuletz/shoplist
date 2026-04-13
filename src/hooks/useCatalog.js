import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCatalog(familyId) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!familyId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('catalog_items')
      .select(`*, item_prices (price, currency)`)
      .eq('family_id', familyId)
      .order('name')

    if (!error) {
      setItems(data.map(item => ({
        ...item,
        price: item.item_prices?.[0]?.price ?? null,
        currency: item.item_prices?.[0]?.currency ?? 'EUR',
      })))
    }
    setLoading(false)
  }, [familyId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem({ name, unit, price, currency = 'EUR' }) {
    const { data: item, error } = await supabase
      .from('catalog_items')
      .insert({ family_id: familyId, name: name.trim(), unit: unit?.trim() || null })
      .select()
      .single()

    if (error) throw error

    if (price != null && price !== '') {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('item_prices').insert({
        user_id: user.id,
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
