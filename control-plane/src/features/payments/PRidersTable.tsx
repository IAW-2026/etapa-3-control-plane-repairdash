'use client';
import { money, fdate } from '@/lib/utils';
import { Table, type Column } from '@/components/table/Table';
import type { PRider } from '@/lib/types';

export function PRidersTable({ rows }: { rows: PRider[] }) {
  const columns: Column[] = [
    {
      label: 'Rider',
      render: x => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></>),
    },
    {
      label: 'Clerk ID',
      render: x => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.clerkId}</span>,
    },
    {
      label: 'Transacciones',
      align: 'right',
      render: x => <span style={{ fontSize: 13.5 }}>{x.txs}</span>,
    },
    {
      label: 'Volumen pagado',
      align: 'right',
      render: x => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{money(x.volume)}</span>,
    },
    {
      label: 'Última tx',
      render: x => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
