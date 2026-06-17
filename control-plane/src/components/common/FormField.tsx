import type { ReactNode } from 'react';

export function FormField({
  label,
  children,
  help,
  error,
}: {
  label: ReactNode;
  children: ReactNode;
  help?: ReactNode;
  error?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>{label}</label>
      {children}
      {help && <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{help}</span>}
      {error && <span style={{ fontSize: 12.5, color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
