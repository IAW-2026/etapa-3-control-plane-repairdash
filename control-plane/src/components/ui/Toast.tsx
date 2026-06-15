'use client';
import { useStore } from '@/lib/store';

const METHOD_COLORS: Record<string, string> = {
  GET:    'background:var(--mut-soft); color:var(--mut)',
  POST:   'background:var(--ok-soft); color:var(--ok)',
  PUT:    'background:var(--violet-soft); color:var(--violet)',
  PATCH:  'background:var(--violet-soft); color:var(--violet)',
  DELETE: 'background:var(--danger-soft); color:var(--danger)',
};

export function Toast() {
  const { state } = useStore();
  const { toast } = state;
  if (!toast) return null;

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
      <span
        style={{
          fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          letterSpacing: '.04em', ...(toast.method in METHOD_COLORS ? Object.fromEntries(METHOD_COLORS[toast.method].split(';').map(s => { const [k, v] = s.split(':'); return [k.trim().replace(/-([a-z])/g, (_m, c) => c.toUpperCase()), v.trim()]; })) : {})
        }}
      >
        {toast.method}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{toast.msg}</span>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.path}</span>
      </div>
    </div>
  );
}
