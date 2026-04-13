import { useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function usePrice(userId) {
  const timers = useRef({})

  const updatePrice = useCallback((catalogItemId, price, currency = 'EUR') => {
    clearTimeout(timers.current[catalogItemId])
    timers.current[catalogItemId] = setTimeout(async () => {
      if (price === '' || price == null) {
        await supabase.from('item_prices')
          .delete()
          .eq('user_id', userId)
          .eq('catalog_item_id', catalogItemId)
      } else {
        await supabase.from('item_prices')
          .upsert({
            user_id: userId,
            catalog_item_id: catalogItemId,
            price: parseFloat(price),
            currency,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,catalog_item_id' })
      }
    }, 600)
  }, [userId])

  return { updatePrice }
}
