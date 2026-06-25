import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  badge,
  action,
  maxWidth = '68ch',
}: {
  title: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  maxWidth?: number | string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: 'clamp(21px, 3vw, 25px)',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-.015em',
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)', maxWidth }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
