'use client';
import { useStore } from '@/lib/store';
import { fdate, getBadge } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Worker } from '@/lib/types';

export function WorkersTable({ rows }: { rows: Worker[] }) {
  const { dispatch } = useStore();

  const columns: Column[] = [
    {
      label: 'Trabajador',
      render: w => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{w.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{w.email}</div></>),
    },
    {
      label: 'Servicios',
      render: w => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{w.servicios}</span>,
    },
    {
      label: 'Estado',
      render: w => { const b = getBadge(w.status); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Onboarding',
      render: w => <span style={{ fontSize: 13, color: w.onboarding ? 'var(--ok)' : 'var(--warn)' }}>{w.onboarding ? 'Completo' : 'Pendiente'}</span>,
    },
    {
      label: 'Alta',
      render: w => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(w.creadoEn)}</span>,
    },
    {
      label: '',
      align: 'right',
      render: w => <button className="btn-table" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'worker', id: w.id, name: w.nombre, status: w.status } })}>Cambiar estado</button>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
