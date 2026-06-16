'use client';
import { useStore } from '@/lib/store';

export function Toast() {
  const { state } = useStore();
  const { toast } = state;
  if (!toast) return null;

  const isError = toast.kind === 'error';
  const accent = isError ? 'var(--danger)' : 'var(--ok)';

  return (
    <div
      className="toast-in"
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 70,
        display: 'flex', alignItems: 'center', gap: 11,
        background: 'var(--surface)', border: '1px solid var(--border2)',
        borderRadius: 13, padding: '12px 16px', boxShadow: 'var(--shadow)',
        maxWidth: 'min(480px, calc(100vw - 40px))',
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: accent }} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{toast.msg}</span>
    </div>
  );
}
