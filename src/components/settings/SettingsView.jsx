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
    if (pw.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(null)
    setLoading(true)
    try {
      await setPassword(pw)
      setPw('')
      setConfirm('')
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
        <input
          className="input"
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>
      <div>
        <label className="label">Confirm password</label>
        <input
          className="input"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
      {success && <p style={{ color: 'var(--accent)', fontSize: 13 }}>Password updated.</p>}
      <button
        className="btn btn-ghost"
        type="submit"
        disabled={loading || !pw || !confirm}
        style={{ alignSelf: 'flex-start', minHeight: 38, padding: '0 var(--sp-4)', fontSize: 14 }}
      >
        {loading ? 'Saving…' : 'Set password'}
      </button>
    </form>
  )
}

export default function SettingsView({ user, catalog }) {
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
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: 'var(--sp-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-6)',
      }}>
        {/* Account */}
        <section>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--sp-3)' }}>
            Account
          </p>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Signed in as</p>
              <p style={{ fontWeight: 500, fontSize: 15 }}>{user.email}</p>
            </div>
            <button
              className="btn btn-danger"
              style={{ alignSelf: 'flex-start', minHeight: 38, padding: '0 var(--sp-4)', fontSize: 14 }}
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </section>

        {/* Password */}
        <section>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--sp-3)' }}>
            Password
          </p>
          <div className="card">
            <PasswordSection setPassword={setPassword} />
          </div>
        </section>

        {/* Prices */}
        <section>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--sp-3)' }}>
            Item Prices
          </p>
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
