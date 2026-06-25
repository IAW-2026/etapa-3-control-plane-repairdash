'use client';
import { money, fdate } from '@/lib/utils';
import { Table, type Column } from '@/components/table/Table';
import type { PDriver } from '@/lib/types';

export function PDriversTable({ rows }: { rows: PDriver[] }) {
  const columns: Column[] = [
    {
      label: 'Driver',
      render: x => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{x.email}</div></>),
    },
    {
      label: 'CBU / CVU',
      render: x => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{x.cbu.slice(0, 14)}…</span>,
    },
    {
      label: 'Disponible',
      align: 'right',
      render: x => <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(x.avail)}</span>,
    },
    {
      label: 'Bloqueado',
      align: 'right',
      render: x => <span style={{ fontSize: 13.5, color: 'var(--text2)' }}>{money(x.locked)}</span>,
    },
    {
      label: 'Actividad',
      render: x => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{x.txs} txs · {x.wds} retiros</span>,
    },
    {
      label: 'Última act.',
      render: x => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(x.last)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
