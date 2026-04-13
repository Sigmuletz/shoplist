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
        currency: item.item_prices?.[0]?.currency ?? 'RON',
      })))
    }
    setLoading(false)
  }, [familyId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem({ name, unit, price, currency = 'RON' }) {
    const { data: item, error } = await supabase
      .from('catalog_items')
      .insert({ family_id: familyId, name: name.trim(), unit: unit?.trim() || null })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return null // duplicate — skip
      throw error
    }

    if (item && price != null && price !== '') {
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

  async function updateItem(id, { name, unit, price, currency = 'RON' }) {
    const { error } = await supabase
      .from('catalog_items')
      .update({ name: name.trim(), unit: unit?.trim() || null })
      .eq('id', id)
    if (error) throw error

    const { data: { user } } = await supabase.auth.getUser()
    if (price != null && price !== '') {
      await supabase.from('item_prices').upsert({
        user_id: user.id,
        catalog_item_id: id,
        price: parseFloat(price),
        currency,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,catalog_item_id' })
    } else {
      await supabase.from('item_prices').delete()
        .eq('user_id', user.id).eq('catalog_item_id', id)
    }

    await fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('catalog_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems }
}
