type FlagKey = 'destacada' | 'usoUnico';

const FLAGS = [
  { key: 'destacada' as const, label: 'Destacada', activeColor: 'var(--warn)', activeBg: 'var(--warn-soft)', activeBorder: 'var(--warn)' },
  { key: 'usoUnico' as const, label: 'Uso unico por usuario', activeColor: 'var(--violet)', activeBg: 'var(--violet-soft)', activeBorder: 'var(--violet)' },
];

export function PromotionFlags({
  values,
  onToggle,
}: {
  values: Record<FlagKey, boolean>;
  onToggle: (key: FlagKey) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {FLAGS.map(({ key, label, activeColor, activeBg, activeBorder }) => {
        const active = values[key];
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: `1px solid ${active ? activeBorder : 'var(--border)'}`,
              borderRadius: 10,
              padding: '9px 13px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: active ? activeBg : 'transparent',
              color: 'var(--text2)',
              transition: 'all .12s',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: 3, background: active ? activeColor : 'var(--border2)' }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
