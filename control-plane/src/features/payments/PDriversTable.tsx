'use client';
import { money, fdate } from '@/lib/utils';
import type { PDriver } from '@/lib/types';

export function PDriversTable({ rows }: { rows: PDriver[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
      <thead><tr>
        {['Driver', 'CBU / CVU', 'Disponible', 'Bloqueado', 'Actividad', 'Última act.'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(x => (
          <tr key={x.clerkId} className="tr-base">
            <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></td>
            <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.cbu.slice(0, 14)}…</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(x.avail)}</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5, color: 'var(--text2)' }}>{money(x.locked)}</td>
            <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{x.txs} txs · {x.wds} retiros</td>
            <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
