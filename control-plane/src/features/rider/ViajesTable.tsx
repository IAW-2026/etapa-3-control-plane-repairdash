'use client';
import { money, fdate, getBadge, STATUS_META, TONES } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Viaje } from '@/lib/types';

export function ViajesTable({ rows }: { rows: Viaje[] }) {
  const columns: Column[] = [
    {
      label: '#',
      render: v => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text2)' }}>#{v.id_viaje}</span>,
    },
    {
      label: 'Cliente',
      render: v => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.cliente}</span>,
    },
    {
      label: 'Tipo trabajo',
      render: v => <span style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.tipo}</span>,
    },
    {
      label: 'Driver',
      render: v => <span style={{ fontSize: 13.5, color: 'var(--text2)' }}>{v.driver}</span>,
    },
    {
      label: 'Pago',
      render: v => {
        const pagoMeta = STATUS_META[v.pago.estado] || { label: v.pago.estado, tone: 'mut' as const };
        return (<><div style={{ fontSize: 13.5, fontWeight: 600 }}>{money(v.pago.monto)}</div><div style={{ fontSize: 11.5, color: TONES[pagoMeta.tone][1] }}>{pagoMeta.label}</div></>);
      },
    },
    {
      label: 'Estado',
      render: v => { const b = getBadge(v.estado); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Fecha',
      render: v => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(v.fecha)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
