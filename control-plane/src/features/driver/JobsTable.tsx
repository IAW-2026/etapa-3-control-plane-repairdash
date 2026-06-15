'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Job } from '@/lib/types';

export function JobsTable({ rows }: { rows: Job[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
      <thead><tr>
        {['Trabajo', 'Rider', 'Driver', 'Dirección', 'Monto est.', 'Estado', 'Creado'].map((h, i) => <th key={i} className={`th${i === 4 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(j => {
          const b = getBadge(j.estado);
          return (
            <tr key={j.id} className="tr-base">
              <td className="td"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{j.id}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{j.servicio}</div></td>
              <td className="td" style={{ fontSize: 13.5 }}>{j.rider}</td>
              <td className="td" style={{ fontSize: 13.5, color: j.driver ? 'var(--text)' : 'var(--text3)' }}>{j.driver || 'Sin asignar'}</td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{j.direccion}</td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(j.monto)}</td>
              <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(j.creadoEn)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
