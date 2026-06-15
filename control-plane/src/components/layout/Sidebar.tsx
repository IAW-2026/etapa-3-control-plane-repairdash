'use client';
import { useStore } from '@/lib/store';
import type { Route } from '@/lib/types';

const NAV_GROUPS = [
  {
    title: 'Visión',
    items: [{ id: 'dashboard' as Route, label: 'Dashboard', dot: 'var(--violet)' }],
  },
  {
    title: 'Usuarios',
    items: [
      { id: 'clientes' as Route,  label: 'Clientes',             dot: 'var(--pink)' },
      { id: 'workers' as Route,   label: 'Trabajadores',         dot: 'var(--violet)' },
      { id: 'pdrivers' as Route,  label: 'Drivers (billeteras)', dot: 'var(--mag)' },
      { id: 'priders' as Route,   label: 'Riders (pagos)',       dot: 'var(--mag)' },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { id: 'jobs' as Route,      label: 'Trabajos',            dot: 'var(--violet)' },
      { id: 'viajes' as Route,    label: 'Viajes',              dot: 'var(--pink)' },
      { id: 'services' as Route,  label: 'Tipos de servicio',   dot: 'var(--violet)' },
    ],
  },
  {
    title: 'Finanzas',
    items: [
      { id: 'transactions' as Route, label: 'Transacciones', dot: 'var(--mag)' },
      { id: 'withdrawals' as Route,  label: 'Retiros',       dot: 'var(--mag)' },
      { id: 'commission' as Route,   label: 'Comisión',      dot: 'var(--mag)' },
    ],
  },
  {
    title: 'Plataforma',
    items: [
      { id: 'promotions' as Route, label: 'Promociones',          dot: 'var(--pink)' },
      { id: 'historial' as Route,  label: 'Historial de promos',  dot: 'var(--pink)' },
      { id: 'feedback' as Route,   label: 'Feedback y disputas',  dot: 'var(--pink)' },
    ],
  },
];

export function Sidebar({ isMobile }: { isMobile: boolean }) {
  const { state, navigate } = useStore();
  const { route, sidebarOpen } = state;

  const sidebarStyle: React.CSSProperties = {
    width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column',
    background: 'var(--surface)', borderRight: '1px solid var(--border)', height: '100%',
    ...(isMobile ? {
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
      transform: `translateX(${sidebarOpen ? '0' : '-105%'})`,
      transition: 'transform .28s ease',
      boxShadow: 'var(--shadow)',
    } : {}),
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '20px 18px 16px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, var(--violet), var(--pink))',
          transform: 'rotate(45deg)', flexShrink: 0, marginLeft: 3,
        }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-grotesk)', fontWeight: 700, fontSize: 16, letterSpacing: '-.01em' }}>Control Plane</span>
          <span style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '.05em' }}>SÚPER ADMIN GLOBAL</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0 12px' }}>
        {NAV_GROUPS.map(g => (
          <div key={g.title} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text3)', padding: '16px 22px 6px' }}>
              {g.title}
            </div>
            {g.items.map(it => {
              const active = route === it.id;
              return (
                <div
                  key={it.id}
                  onClick={() => navigate(it.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                    margin: '1px 10px', fontSize: 14,
                    color: active ? 'var(--text)' : 'var(--text2)',
                    fontWeight: active ? 600 : 400,
                    background: active ? 'var(--violet-soft)' : 'transparent',
                    transition: 'background .12s',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? 'var(--violet-soft)' : 'transparent'; }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: it.dot }} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['RepairDash', 'var(--pink)'], ['DriverApp', 'var(--violet)'], ['Payments', 'var(--mag)']].map(([name, color]) => (
            <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--text3)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              {name}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--violet), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#FFF', flexShrink: 0,
          }}>SA</div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Súper admin</span>
            <span style={{ fontSize: 11.5, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@controlplane.app</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
