import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(userId) {
  const [profile, setProfile] = useState(undefined) // undefined = loading
  const [members, setMembers] = useState([])

  const fetchMembers = useCallback(async (familyId) => {
    if (!familyId) { setMembers([]); return }
    const { data } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('family_id', familyId)
    setMembers(data || [])
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    // Get email from auth
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const email = authUser?.email

    const { data } = await supabase
      .from('profiles')
      .select('*, families(name)')
      .eq('id', userId)
      .maybeSingle()

    if (!data) {
      // New user — create profile row
      await supabase.from('profiles').insert({ id: userId, email })
      const profile = { id: userId, family_id: null, telegram_chat_id: null, families: null, email }
      setProfile(profile)
      setMembers([])
    } else {
      // Sync email if changed
      if (email && data.email !== email) {
        await supabase.from('profiles').update({ email }).eq('id', userId)
        data.email = email
      }
      setProfile(data)
      fetchMembers(data.family_id)
    }
  }, [userId, fetchMembers])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function setFamily(familyId) {
    await supabase.from('profiles').update({ family_id: familyId }).eq('id', userId)
    await fetchProfile()
    await fetchMembers(familyId)
  }

  async function updateTelegramChatId(chatId) {
    const value = chatId?.trim() || null
    await supabase.from('profiles').update({ telegram_chat_id: value }).eq('id', userId)
    setProfile(prev => ({ ...prev, telegram_chat_id: value }))
  }

  return {
    profile,
    members,
    loading: profile === undefined,
    setFamily,
    updateTelegramChatId,
    refetch: fetchProfile,
  }
}
