'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Withdrawal } from '@/lib/types';

export function WithdrawalsTable({ rows }: { rows: Withdrawal[] }) {
  const columns: Column[] = [
    {
      label: 'Retiro',
      render: w => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{w.id}</span>,
    },
    {
      label: 'Driver',
      render: w => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{w.driver}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{w.cbu.slice(0, 14)}…</div></>),
    },
    {
      label: 'Monto',
      align: 'right',
      render: w => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{money(w.amount)}</span>,
    },
    {
      label: 'Estado',
      render: w => { const b = getBadge(w.status); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Solicitado',
      render: w => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.createdAt)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}

export function WithdrawalsFooter() {
  return (
    <div style={{ marginTop: 14, padding: '13px 16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)', fontSize: 13, color: 'var(--text2)' }}>
      Los retiros son <strong>solo lectura</strong> desde Control Plane. La aprobación o rechazo se gestiona en el panel de administración de Payments.
    </div>
  );
}
