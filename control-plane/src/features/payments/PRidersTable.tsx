'use client';
import { money, fdate } from '@/lib/utils';
import type { PRider } from '@/lib/types';

export function PRidersTable({ rows }: { rows: PRider[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
      <thead><tr>
        {['Rider', 'Clerk ID', 'Transacciones', 'Volumen pagado', 'Última transacción'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(x => (
          <tr key={x.clerkId} className="tr-base">
            <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></td>
            <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.clerkId}</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{x.txs}</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(x.volume)}</td>
            <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
