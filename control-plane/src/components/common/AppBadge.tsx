import type { CSSProperties } from 'react';

const TONES: Record<string, [string, string]> = {
  pink: ['var(--pink-soft)', 'var(--pink)'],
  violet: ['var(--violet-soft)', 'var(--violet)'],
  mag: ['var(--mag-soft)', 'var(--mag)'],
  mut: ['var(--mut-soft)', 'var(--mut)'],
};

export function AppBadge({
  label,
  tone = 'mut',
  style,
}: {
  label: string;
  tone?: string;
  style?: CSSProperties;
}) {
  const [bg, fg] = TONES[tone] || TONES.mut;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11.5,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 999,
        background: bg,
        color: fg,
        ...style,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />
      {label}
    </span>
  );
}
