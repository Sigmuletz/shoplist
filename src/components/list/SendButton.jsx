import { useState } from 'react'
import { sendList } from '../../lib/telegram'

export default function SendButton({ items, listName, onSent, chatId }) {
  const [state, setState] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState(null)

  async function handleSend() {
    setState('loading')
    setError(null)
    try {
      await sendList(items, listName, chatId)
      setState('success')
      await onSent()
      setTimeout(() => setState('idle'), 2500)
    } catch (err) {
      setError(err.message)
      setState('error')
    }
  }

  const isLoading = state === 'loading'
  const isSuccess = state === 'success'

  return (
    <div>
      <button
        className="btn btn-primary"
        style={{
          width: '100%',
          fontSize: 16,
          height: 52,
          background: isSuccess ? 'var(--accent)' : undefined,
        }}
        onClick={handleSend}
        disabled={isLoading || isSuccess || items.length === 0}
      >
        {isLoading && <span className="spinner" />}
        {isSuccess && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        {!isLoading && !isSuccess && (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send to Telegram
          </>
        )}
        {isSuccess && ' Sent!'}
      </button>
      {state === 'error' && (
        <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 'var(--sp-2)', textAlign: 'center' }}>
          {error || 'Failed to send. Try again.'}
        </p>
      )}
    </div>
  )
}
