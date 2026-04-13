import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import AuthScreen from './components/auth/AuthScreen'
import AppShell from './components/layout/AppShell'
import FamilyPicker from './components/onboarding/FamilyPicker'

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{
        width: 32, height: 32,
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }} />
    </div>
  )
}

function ProfileGate({ user }) {
  const { profile, loading, setFamily, updateTelegramChatId } = useProfile(user.id)

  if (loading) return <Spinner />
  if (!profile?.family_id) return <FamilyPicker setFamily={setFamily} />

  return (
    <AppShell
      user={user}
      profile={profile}
      updateTelegramChatId={updateTelegramChatId}
    />
  )
}

export default function App() {
  const { session, loading } = useAuth()

  if (loading) return <Spinner />
  if (!session) return <AuthScreen />

  return <ProfileGate user={session.user} />
}
