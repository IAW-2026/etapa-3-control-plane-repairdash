'use client';
import { money, fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Job } from '@/lib/types';

export function JobsTable({ rows }: { rows: Job[] }) {
  const columns: Column[] = [
    {
      label: 'Trabajo',
      render: j => (<><div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{j.id}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{j.servicio}</div></>),
    },
    {
      label: 'Rider',
      render: j => <span style={{ fontSize: 13.5 }}>{j.rider}</span>,
    },
    {
      label: 'Driver',
      render: j => <span style={{ fontSize: 13.5, color: j.driver ? 'var(--text)' : 'var(--text3)' }}>{j.driver || 'Sin asignar'}</span>,
    },
    {
      label: 'Dirección',
      render: j => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{j.direccion}</span>,
    },
    {
      label: 'Monto est.',
      align: 'right',
      render: j => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{money(j.monto)}</span>,
    },
    {
      label: 'Estado',
      render: j => { const b = getBadge(j.estado); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Creado',
      render: j => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(j.creadoEn)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
