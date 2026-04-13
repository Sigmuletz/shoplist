import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function AuthScreen() {
  const { signInWithPassword, signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('password') // 'password' | 'magic'
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handlePasswordLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithPassword(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signInWithMagicLink(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
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
      <div style={{
        width: '100%',
        maxWidth: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-6)',
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 'var(--sp-1)' }}>Shoplist</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Sign in to manage your shopping lists.
          </p>
        </div>

        {sent ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-6)' }}>
            <div style={{ fontSize: 32, marginBottom: 'var(--sp-3)' }}>📬</div>
            <p style={{ fontWeight: 600, marginBottom: 'var(--sp-2)' }}>Check your email</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Magic link sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
            </p>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 'var(--sp-5)', width: '100%' }}
              onClick={() => { setSent(false); setMode('password') }}
            >
              Back to sign in
            </button>
          </div>
        ) : mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !email || !password}
              style={{ width: '100%', marginTop: 'var(--sp-1)' }}
            >
              {loading ? <span className="spinner" /> : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={() => { setError(null); setMode('magic') }}
              style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', padding: 'var(--sp-2)' }}
            >
              Sign in with magic link instead
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !email}
              style={{ width: '100%', marginTop: 'var(--sp-1)' }}
            >
              {loading ? <span className="spinner" /> : 'Send magic link'}
            </button>

            <button
              type="button"
              onClick={() => { setError(null); setMode('password') }}
              style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', padding: 'var(--sp-2)' }}
            >
              Sign in with password instead
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
