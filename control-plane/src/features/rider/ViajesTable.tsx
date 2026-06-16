'use client';
import { money, fdate, getBadge, STATUS_META, TONES } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Viaje } from '@/lib/types';

export function ViajesTable({ rows }: { rows: Viaje[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
      <thead><tr>
        {['#', 'Cliente', 'Tipo de trabajo', 'Driver', 'Pago', 'Estado', 'Fecha'].map((h, i) => <th key={i} className="th">{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(v => {
          const b = getBadge(v.estado);
          const pagoMeta = STATUS_META[v.pago.estado] || { label: v.pago.estado, tone: 'mut' as const };
          return (
            <tr key={v.id_viaje} className="tr-base">
              <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text2)' }}>#{v.id_viaje}</td>
              <td className="td" style={{ fontSize: 13.5, fontWeight: 600 }}>{v.cliente}</td>
              <td className="td" style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.tipo}</td>
              <td className="td" style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.driver}</td>
              <td className="td">
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{money(v.pago.monto)}</div>
                <div style={{ fontSize: 11.5, color: TONES[pagoMeta.tone][1] }}>{pagoMeta.label}</div>
              </td>
              <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(v.fecha)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
