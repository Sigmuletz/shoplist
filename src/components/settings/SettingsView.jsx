import { useState } from 'react'
import Header from '../layout/Header'
import PriceEditor from './PriceEditor'
import { useAuth } from '../../hooks/useAuth'

export default function SettingsView({ user, catalog }) {
  const { signOut } = useAuth()
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
