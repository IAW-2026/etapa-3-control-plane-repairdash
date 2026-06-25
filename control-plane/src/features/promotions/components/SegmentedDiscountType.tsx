export function SegmentedDiscountType({ value, onChange }: { value: '%' | '$'; onChange: (value: '%' | '$') => void }) {
  return (
    <div style={{ display: 'flex', padding: 3, borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
      {([['%', 'Porcentaje'], ['$', 'Monto fijo']] as const).map(([val, label]) => (
        <button
          key={val}
          type="button"
          aria-pressed={value === val}
          aria-label={label}
          onClick={() => onChange(val)}
          style={{
            flex: 1,
            border: 'none',
            borderRadius: 8,
            padding: '8px 6px',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            background: value === val ? 'var(--surface)' : 'transparent',
            color: value === val ? 'var(--text)' : 'var(--text3)',
            boxShadow: value === val ? '0 1px 4px rgba(20,10,40,.18)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
