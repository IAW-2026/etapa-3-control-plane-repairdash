'use client';
import { useStore } from '@/lib/store';

const ROUTE_META: Record<string, { group: string; title: string }> = {
  dashboard:    { group: 'Visión',      title: 'Dashboard' },
  clientes:     { group: 'Usuarios',    title: 'Clientes' },
  workers:      { group: 'Usuarios',    title: 'Trabajadores' },
  pdrivers:     { group: 'Usuarios',    title: 'Drivers (billeteras)' },
  priders:      { group: 'Usuarios',    title: 'Riders (pagos)' },
  jobs:         { group: 'Operaciones', title: 'Trabajos' },
  viajes:       { group: 'Operaciones', title: 'Viajes' },
  services:     { group: 'Operaciones', title: 'Tipos de servicio' },
  transactions: { group: 'Finanzas',    title: 'Transacciones' },
  withdrawals:  { group: 'Finanzas',    title: 'Retiros' },
  commission:   { group: 'Finanzas',    title: 'Comisión' },
  promotions:   { group: 'Plataforma',  title: 'Promociones' },
  historial:    { group: 'Plataforma',  title: 'Historial de promos' },
  feedback:     { group: 'Plataforma',  title: 'Feedback y disputas' },
};

export function Header({ isMobile }: { isMobile: boolean }) {
  const { state, dispatch, setTheme } = useStore();
  const { route, theme } = state;
  const meta = ROUTE_META[route] || ROUTE_META.dashboard;

  return (
    <header style={{
      height: 58, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 clamp(14px, 3vw, 28px)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      {isMobile && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 9, padding: '9px 8px', cursor: 'pointer',
          }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ width: 16, height: 2, borderRadius: 2, background: 'var(--text2)', display: 'block' }} />
          ))}
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 13, color: 'var(--text3)', whiteSpace: 'nowrap' }}>{meta.group}</span>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta.title}</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
          {(['light', 'dark'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                border: 'none', borderRadius: 999, padding: '5px 13px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
                background: theme === t ? (t === 'light' ? 'var(--surface)' : 'var(--surface3)') : 'transparent',
                color: theme === t ? 'var(--text)' : 'var(--text3)',
                boxShadow: theme === t && t === 'light' ? '0 1px 4px rgba(20,10,40,.18)' : 'none',
              }}
            >
              {t === 'light' ? 'Claro' : 'Oscuro'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
