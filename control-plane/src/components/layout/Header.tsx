'use client';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { routeFromPath } from '@/lib/routes';

const ROUTE_META: Record<string, { group: string; title: string }> = {
  dashboard:    { group: 'Visión',     title: 'Dashboard' },
  transactions: { group: 'Payments',   title: 'Transacciones' },
  withdrawals:  { group: 'Payments',   title: 'Retiros' },
  commission:   { group: 'Payments',   title: 'Comisión' },
  clientes:     { group: 'Riders',     title: 'Clientes' },
  viajes:       { group: 'Riders',     title: 'Viajes' },
  priders:      { group: 'Riders',     title: 'Pagos' },
  workers:      { group: 'Drivers',    title: 'Trabajadores' },
  jobs:         { group: 'Drivers',    title: 'Trabajos' },
  services:     { group: 'Drivers',    title: 'Tipos de servicio' },
  pdrivers:     { group: 'Drivers',    title: 'Billeteras' },
  promotions:   { group: 'Promotions', title: 'Promociones' },
  historial:    { group: 'Promotions', title: 'Historial de promos' },
  feedback:     { group: 'Feedback',   title: 'Feedback y disputas' },
};

export function Header() {
  const { state, dispatch, setTheme } = useStore();
  const { theme } = state;
  const route = routeFromPath(usePathname());
  const meta = ROUTE_META[route] || ROUTE_META.dashboard;

  return (
    <header style={{
      height: 58, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 clamp(14px, 3vw, 28px)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <button
        type="button"
        className="app-hamburger"
        aria-label="Abrir o cerrar el menú"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ width: 16, height: 2, borderRadius: 2, background: 'var(--text2)', display: 'block' }} />
        ))}
      </button>

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
