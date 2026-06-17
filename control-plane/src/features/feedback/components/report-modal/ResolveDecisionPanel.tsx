type Decision = 'AFavor' | 'EnContra';

export function ResolveDecisionPanel({
  decision,
  onDecision,
}: {
  decision: Decision | null;
  onDecision: (decision: Decision) => void;
}) {
  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>Resolver disputa</span>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {([
          ['AFavor', 'A favor', 'Se desestima el reporte', 'var(--ok)', 'var(--ok-soft)'],
          ['EnContra', 'En contra', 'Falla contra el reportado', 'var(--danger)', 'var(--danger-soft)'],
        ] as const).map(([value, title, sub, fg, bg]) => {
          const active = decision === value;
          return (
            <div
              key={value}
              onClick={() => onDecision(value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '12px 14px',
                borderRadius: 11,
                cursor: 'pointer',
                border: `1px solid ${active ? fg : 'var(--border)'}`,
                background: active ? bg : 'transparent',
                transition: 'all .12s',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: fg }}>{title}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text3)' }}>{sub}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
