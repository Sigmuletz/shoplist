import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProfile(userId) {
  const [profile, setProfile] = useState(undefined) // undefined = loading
  const [members, setMembers] = useState([])

  const fetchMembers = useCallback(async (familyId) => {
    if (!familyId) { setMembers([]); return }
    const { data } = await supabase
      .from('profiles')
      .select('id, email, icon')
      .eq('family_id', familyId)
    setMembers(data || [])
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    // Get email from auth
    const { data: { user: authUser } } = await supabase.auth.getUser()
    const email = authUser?.email

    let { data } = await supabase
      .from('profiles')
      .select('*, families(name)')
      .eq('id', userId)
      .maybeSingle()

    if (!data) {
      // Profile not visible (new user or RLS issue) — try insert, ignore duplicate key
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, email })

      if (!insertError || insertError.code === '23505') {
        // Inserted or already existed — fetch again
        const { data: refetched } = await supabase
          .from('profiles')
          .select('*, families(name)')
          .eq('id', userId)
          .maybeSingle()
        data = refetched
      }
    }

    if (data) {
      // Sync email if changed
      if (email && data.email !== email) {
        await supabase.from('profiles').update({ email }).eq('id', userId)
        data.email = email
      }
      setProfile(data)
      fetchMembers(data.family_id)
    } else {
      // Truly can't read profile — surface minimal state
      setProfile({ id: userId, family_id: null, telegram_chat_id: null, families: null, email })
      setMembers([])
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

  async function updateIcon(icon) {
    await supabase.from('profiles').update({ icon }).eq('id', userId)
    setProfile(prev => ({ ...prev, icon }))
    setMembers(prev => prev.map(m => m.id === userId ? { ...m, icon } : m))
  }

  return {
    profile,
    members,
    loading: profile === undefined,
    setFamily,
    updateTelegramChatId,
    updateIcon,
    refetch: fetchProfile,
  }
}
