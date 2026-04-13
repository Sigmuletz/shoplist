import { useAuth } from './hooks/useAuth'
import AuthScreen from './components/auth/AuthScreen'
import AppShell from './components/layout/AppShell'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return <AppShell user={session.user} />
}
