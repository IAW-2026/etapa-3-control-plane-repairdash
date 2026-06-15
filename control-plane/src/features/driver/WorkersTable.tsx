'use client';
import { useStore } from '@/lib/store';
import { fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Worker } from '@/lib/types';

export function WorkersTable({ rows }: { rows: Worker[] }) {
  const { dispatch } = useStore();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 840 }}>
      <thead><tr>
        {['Trabajador', 'Servicios', 'Estado', 'Onboarding', 'Alta', ''].map((h, i) => <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(w => {
          const b = getBadge(w.status);
          return (
            <tr key={w.id} className="tr-base">
              <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{w.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{w.email}</div></td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{w.servicios}</td>
              <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
              <td className="td" style={{ fontSize: 13, color: w.onboarding ? 'var(--ok)' : 'var(--warn)' }}>{w.onboarding ? 'Completo' : 'Pendiente'}</td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.creadoEn)}</td>
              <td className="td" style={{ textAlign: 'right' }}>
                <button className="btn-table" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'worker', id: w.id, name: w.nombre, status: w.status } })}>Cambiar estado</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
