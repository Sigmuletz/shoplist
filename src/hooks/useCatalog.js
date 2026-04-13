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
      .select('*')
      .eq('family_id', familyId)
      .order('name')

    if (!error) setItems(data)
    setLoading(false)
  }, [familyId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function addItem({ name, unit, price, currency = 'RON', category }) {
    const { data: item, error } = await supabase
      .from('catalog_items')
      .insert({
        family_id: familyId,
        name: name.trim(),
        unit: unit?.trim() || null,
        price: price != null && price !== '' ? parseFloat(price) : null,
        currency,
        category: category?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') return null // duplicate — skip
      throw error
    }

    await fetchItems()
    return item
  }

  async function updateItem(id, { name, unit, price, currency = 'RON', category }) {
    const { error } = await supabase
      .from('catalog_items')
      .update({
        name: name.trim(),
        unit: unit?.trim() || null,
        price: price != null && price !== '' ? parseFloat(price) : null,
        currency,
        category: category?.trim() || null,
      })
      .eq('id', id)
    if (error) throw error
    await fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('catalog_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems }
}
