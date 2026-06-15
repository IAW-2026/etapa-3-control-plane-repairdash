'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Transaction } from '@/lib/types';

export function TransactionsTable({ rows }: { rows: Transaction[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 940 }}>
      <thead><tr>
        {['Transacción', 'Rider → Driver', 'Monto', 'Comisión', 'Estado', 'Fecha'].map((h, i) => <th key={i} className={`th${i === 2 || i === 3 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(t => {
          const b = getBadge(t.status);
          return (
            <tr key={t.id} className="tr-base">
              <td className="td"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{t.id}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{t.trabajo}</div></td>
              <td className="td" style={{ fontSize: 13.5 }}>{t.rider} → {t.driver}</td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(t.amount)}</td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13, color: 'var(--text2)' }}>{t.comision ? money(t.comision) : '—'}</td>
              <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(t.createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
