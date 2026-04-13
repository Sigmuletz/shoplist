export default function QuantityStepper({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
      <button
        onClick={() => onChange(value - 1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 'var(--r-sm)',
          background: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        −
      </button>
      <span style={{
        width: 28,
        textAlign: 'center',
        fontWeight: 600,
        fontSize: 15,
        color: 'var(--text-primary)',
        flexShrink: 0,
      }}>
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        style={{
          width: 30,
          height: 30,
          borderRadius: 'var(--r-sm)',
          background: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        +
      </button>
    </div>
  )
}
