import { useState } from 'react'
import Header from '../layout/Header'
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

const FOOD_ICONS = [
  '🍎','🍊','🍋','🍇','🍓','🍒','🥝','🍑',
  '🥑','🥕','🌽','🧅','🧄','🥦','🍄','🌶️',
  '🧀','🥚','🍕','🍔','🌮','🍗','🥩','🍜',
  '🍣','🍱','🥗','🍰','🍩','🍪','🧁','☕',
]

function IconPicker({ current, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
      {FOOD_ICONS.map(icon => (
        <button
          key={icon}
          onClick={() => onPick(icon)}
          style={{
            width: 44, height: 44,
            borderRadius: 'var(--r-md)',
            fontSize: 22,
            border: `2px solid ${current === icon ? 'var(--accent)' : 'transparent'}`,
            background: current === icon ? 'var(--accent-dim)' : 'var(--bg-elevated)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color var(--t-fast), background var(--t-fast)',
          }}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

export function UserAvatar({ icon, email, size = 28 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--bg-elevated)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: icon ? size * 0.6 : size * 0.45,
      fontWeight: icon ? 'normal' : 600,
      color: 'var(--text-secondary)',
      flexShrink: 0,
      lineHeight: 1,
    }}>
      {icon || (email?.[0] ?? '?').toUpperCase()}
    </span>
  )
}

export default function SettingsView({ user, profile, members, updateTelegramChatId, updateIcon }) {
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

        {/* Icon */}
        <section>
          <SectionLabel>Your icon</SectionLabel>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <UserAvatar icon={profile?.icon} email={user.email} size={44} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pick a food icon to represent you.</p>
            </div>
            <IconPicker current={profile?.icon} onPick={updateIcon} />
          </div>
        </section>

        {/* Family */}
        <section>
          <SectionLabel>Family</SectionLabel>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Family group</p>
              <p style={{ fontWeight: 600, fontSize: 17 }}>{profile?.families?.name ?? '—'}</p>
            </div>
            {members.length > 0 && (
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 'var(--sp-2)' }}>Members</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {members.map(m => (
                    <div key={m.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-2)',
                      padding: 'var(--sp-1) 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: 14,
                    }}>
                      <UserAvatar icon={m.icon} email={m.email} size={28} />
                      <span style={{ color: m.id === user.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {m.email ?? m.id}
                        {m.id === user.id && <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 6 }}>you</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      </div>
    </div>
  )
}
