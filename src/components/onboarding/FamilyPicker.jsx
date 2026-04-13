import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function FamilyPicker({ setFamily }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setError(null)
    setLoading(true)
    try {
      // Look for existing family by name
      const { data: existing } = await supabase
        .from('families')
        .select('id')
        .eq('name', trimmed)
        .maybeSingle()

      if (existing) {
        await setFamily(existing.id)
      } else {
        // Create new family
        const { data: created, error: createErr } = await supabase
          .from('families')
          .insert({ name: trimmed })
          .select('id')
          .single()
        if (createErr) throw createErr
        await setFamily(created.id)
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 'var(--sp-6)',
    }}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 'var(--sp-2)' }}>Join a family</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
            Enter your family name to join an existing group, or create a new one. Everyone in your household uses the same name.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div>
            <label className="label">Family name</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Smith"
              autoFocus
              required
            />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || !name.trim()}
            style={{ width: '100%' }}
          >
            {loading ? <span className="spinner" /> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
