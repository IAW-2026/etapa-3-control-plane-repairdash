'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useStore } from '@/lib/store';
import { ROUTE_PATH } from '@/lib/routes';
import type { Route } from '@/lib/types';

type NavLink = { kind: 'link'; id: Route; label: string; dot: string };
type NavGroup = {
  kind: 'group';
  key: string;
  label: string;
  dot: string;
  items: { id: Route; label: string }[];
};
type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { kind: 'link', id: 'dashboard', label: 'Dashboard', dot: 'var(--violet)' },
  {
    kind: 'group', key: 'payments', label: 'Payments', dot: 'var(--mag)',
    items: [
      { id: 'transactions', label: 'Transacciones' },
      { id: 'withdrawals',  label: 'Retiros' },
      { id: 'commission',   label: 'Comisión' },
    ],
  },
  {
    kind: 'group', key: 'riders', label: 'Riders', dot: 'var(--pink)',
    items: [
      { id: 'clientes', label: 'Clientes' },
      { id: 'viajes',   label: 'Viajes' },
      { id: 'priders',  label: 'Pagos' },
    ],
  },
  {
    kind: 'group', key: 'drivers', label: 'Drivers', dot: 'var(--violet)',
    items: [
      { id: 'workers',   label: 'Trabajadores' },
      { id: 'jobs',      label: 'Trabajos' },
      { id: 'services',  label: 'Tipos de servicio' },
      { id: 'pdrivers',  label: 'Billeteras' },
    ],
  },
  {
    kind: 'group', key: 'promotions', label: 'Promotions', dot: 'var(--pink)',
    items: [
      { id: 'promotions', label: 'Promociones' },
      { id: 'historial',  label: 'Historial de promos' },
    ],
  },
  { kind: 'link', id: 'feedback', label: 'Feedback', dot: 'var(--pink)' },
];

export function Sidebar() {
  const { state, dispatch } = useStore();
  const { sidebarOpen } = state;
  const pathname = usePathname();
  const { user } = useUser();

  // Grupos abiertos: por defecto el que contiene la ruta activa.
  const [open, setOpen] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const e of NAV) {
      if (e.kind === 'group' && e.items.some(it => pathname === ROUTE_PATH[it.id])) {
        initial.add(e.key);
      }
    }
    return initial;
  });
  const toggle = (key: string) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  const linkStyle = (active: boolean, indent = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
    margin: '1px 10px', fontSize: 14, textDecoration: 'none',
    color: active ? 'var(--text)' : 'var(--text2)',
    fontWeight: active ? 600 : 400,
    background: active ? 'var(--violet-soft)' : 'transparent',
    transition: 'background .12s',
    ...(indent ? { paddingLeft: 30 } : {}),
  });

  return (
    <aside className="app-sidebar" data-open={sidebarOpen}>
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
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0 12px' }}>
        {NAV.map(entry => {
          if (entry.kind === 'link') {
            const active = pathname === ROUTE_PATH[entry.id];
            return (
              <Link
                key={entry.id}
                href={ROUTE_PATH[entry.id]}
                onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
                style={linkStyle(active)}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? 'var(--violet-soft)' : 'transparent'; }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: entry.dot }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.label}</span>
              </Link>
            );
          }

          const isOpen = open.has(entry.key);
          const hasActiveChild = entry.items.some(it => pathname === ROUTE_PATH[it.id]);
          return (
            <div key={entry.key} style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                type="button"
                onClick={() => toggle(entry.key)}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? 'Contraer' : 'Expandir'} ${entry.label}`}
                style={{
                  ...linkStyle(hasActiveChild && !isOpen),
                  width: 'auto', border: 'none', textAlign: 'left', fontFamily: 'inherit',
                  fontSize: 14, fontWeight: hasActiveChild ? 600 : 400,
                  color: hasActiveChild ? 'var(--text)' : 'var(--text2)',
                }}
                onMouseEnter={e => { if (!(hasActiveChild && !isOpen)) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = (hasActiveChild && !isOpen) ? 'var(--violet-soft)' : 'transparent'; }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: entry.dot }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.label}</span>
                <span style={{
                  flexShrink: 0, fontSize: 10, color: 'var(--text3)',
                  transition: 'transform .15s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>▶</span>
              </button>
              {isOpen && entry.items.map(it => {
                const active = pathname === ROUTE_PATH[it.id];
                return (
                  <Link
                    key={it.id}
                    href={ROUTE_PATH[it.id]}
                    onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
                    style={linkStyle(active, true)}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = active ? 'var(--violet-soft)' : 'transparent'; }}
                  >
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <footer style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserButton />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || user?.firstName || 'Súper admin'}</span>
            <span style={{ fontSize: 11.5, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.primaryEmailAddress?.emailAddress || ''}</span>
          </div>
        </div>
      </footer>
    </aside>
  );
}
