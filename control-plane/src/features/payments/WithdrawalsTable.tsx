'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Withdrawal } from '@/lib/types';

export function WithdrawalsTable({ rows }: { rows: Withdrawal[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
      <thead><tr>
        {['Retiro', 'Driver', 'Monto', 'Estado', 'Solicitado'].map((h, i) => <th key={i} className={`th${i === 2 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(w => {
          const b = getBadge(w.status);
          return (
            <tr key={w.id} className="tr-base">
              <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{w.id}</td>
              <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{w.driver}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{w.cbu.slice(0, 14)}…</div></td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(w.amount)}</td>
              <td className="td"><Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} /></td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// Nota mostrada bajo la tabla de retiros (solo lectura).
export function WithdrawalsFooter() {
  return (
    <div style={{ marginTop: 14, padding: '13px 16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', fontSize: 13, color: 'var(--text2)' }}>
      Los retiros son <strong>solo lectura</strong> desde Control Plane. La aprobación o rechazo se gestiona en el panel de administración de Payments.
    </div>
  );
}
