import { useState } from 'react'
import Header from '../layout/Header'
import PriceEditor from './PriceEditor'
import { useAuth } from '../../hooks/useAuth'

function PasswordSection({ setPassword }) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (pw !== confirm) { setError('Passwords do not match'); return }
    if (pw.length < 6) { setError('Min 6 characters'); return }
    setError(null)
    setLoading(true)
    try {
      await setPassword(pw)
      setPw(''); setConfirm('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div>
        <label className="label">New password</label>
        <input className="input" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
      </div>
      <div>
        <label className="label">Confirm password</label>
        <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password" />
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
      {success && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Password updated.</p>}
      <button className="btn btn-ghost" type="submit" disabled={loading || !pw || !confirm}
        style={{ alignSelf: 'flex-start', minHeight: 38, padding: '0 var(--sp-4)', fontSize: 14 }}>
        {loading ? 'Saving…' : 'Set password'}
      </button>
    </form>
  )
}

function TelegramSection({ chatId, onUpdate }) {
  const [value, setValue] = useState(chatId || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    await onUpdate(value)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div>
        <label className="label">Chat ID</label>
        <input
          className="input"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="-1001234567890"
        />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
          Group/channel ID where shopping list will be sent.
        </p>
      </div>
      {success && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Saved.</p>}
      <button className="btn btn-ghost" type="submit" disabled={loading}
        style={{ alignSelf: 'flex-start', minHeight: 38, padding: '0 var(--sp-4)', fontSize: 14 }}>
        {loading ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--sp-3)' }}>
      {children}
    </p>
  )
}

export default function SettingsView({ user, profile, catalog, updateTelegramChatId }) {
  const { signOut, setPassword } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Settings" />

      <div style={{
        flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)',
      }}>

        {/* Family */}
        <section>
          <SectionLabel>Family</SectionLabel>
          <div className="card">
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Family group</p>
            <p style={{ fontWeight: 600, fontSize: 17 }}>{profile?.families?.name ?? '—'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--sp-1)' }}>
              Catalog and lists shared with all family members.
            </p>
          </div>
        </section>

        {/* Telegram */}
        <section>
          <SectionLabel>Telegram</SectionLabel>
          <div className="card">
            <TelegramSection chatId={profile?.telegram_chat_id} onUpdate={updateTelegramChatId} />
          </div>
        </section>

        {/* Account */}
        <section>
          <SectionLabel>Account</SectionLabel>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Signed in as</p>
              <p style={{ fontWeight: 500, fontSize: 15 }}>{user.email}</p>
            </div>
            <button className="btn btn-danger" onClick={handleSignOut} disabled={signingOut}
              style={{ alignSelf: 'flex-start', minHeight: 38, padding: '0 var(--sp-4)', fontSize: 14 }}>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </section>

        {/* Password */}
        <section>
          <SectionLabel>Password</SectionLabel>
          <div className="card">
            <PasswordSection setPassword={setPassword} />
          </div>
        </section>

        {/* Prices */}
        <section>
          <SectionLabel>Item Prices</SectionLabel>
          <div className="card">
            {catalog.loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
            ) : (
              <PriceEditor items={catalog.items} userId={user.id} onRefetch={catalog.refetch} />
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
