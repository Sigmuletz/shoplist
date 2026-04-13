import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(userId) {
  const [profile, setProfile] = useState(undefined) // undefined = loading

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('profiles')
      .select('*, families(name)')
      .eq('id', userId)
      .maybeSingle()

    if (!data) {
      // New user — create profile row
      await supabase.from('profiles').insert({ id: userId })
      setProfile({ id: userId, family_id: null, telegram_chat_id: null, families: null })
    } else {
      setProfile(data)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function setFamily(familyId) {
    await supabase.from('profiles').update({ family_id: familyId }).eq('id', userId)
    await fetchProfile()
  }

  async function updateTelegramChatId(chatId) {
    const value = chatId?.trim() || null
    await supabase.from('profiles').update({ telegram_chat_id: value }).eq('id', userId)
    setProfile(prev => ({ ...prev, telegram_chat_id: value }))
  }

  return {
    profile,
    loading: profile === undefined,
    setFamily,
    updateTelegramChatId,
    refetch: fetchProfile,
  }
}
