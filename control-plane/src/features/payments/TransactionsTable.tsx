'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Transaction } from '@/lib/types';

export function TransactionsTable({ rows }: { rows: Transaction[] }) {
  const columns: Column[] = [
    {
      label: 'Transacción',
      render: t => (<><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{t.id}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' }}>{t.trabajo}</div></>),
    },
    {
      label: 'Rider → Driver',
      render: t => <div style={{ textAlign: 'right', fontSize: 12 }}><span style={{ whiteSpace: 'nowrap' }}>{t.rider}</span>{' → '}<span style={{ whiteSpace: 'nowrap' }}>{t.driver}</span></div>,
    },
    {
      label: 'Monto',
      align: 'right',
      render: t => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{money(t.amount)}</span>,
    },
    {
      label: 'Comisión',
      align: 'right',
      render: t => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{t.comision ? money(t.comision) : '—'}</span>,
    },
    {
      label: 'Estado',
      render: t => { const b = getBadge(t.status); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Fecha',
      render: t => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(t.createdAt)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
