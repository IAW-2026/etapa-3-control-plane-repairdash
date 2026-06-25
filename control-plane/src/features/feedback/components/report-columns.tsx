import { Badge } from '@/components/ui/Badge';
import type { Column } from '@/components/table/Table';
import { fdate, getBadge, STATUS_META, TONES } from '@/lib/utils';

export function buildReportColumns(onOpenReport: (id: string) => void): Column[] {
  return [
    {
      label: 'Reporte',
      render: r => (
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--text3)' }}>{r.id} - {r.trabajo.tipoDeTrabajo}</div>
          <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.descripcion}</div>
        </div>
      ),
    },
    {
      label: 'Reportante -> Reportado',
      render: r => (
        <span style={{ fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{r.reportante.nombre} {r.reportante.apellido}</span>
          <span style={{ color: 'var(--text3)' }}>{' -> '}</span>
          <span>{r.reportado.nombre} {r.reportado.apellido}</span>
        </span>
      ),
    },
    {
      label: 'Estado',
      render: r => { const b = getBadge(r.estado); return <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />; },
    },
    {
      label: 'Decision',
      render: r => {
        const decMeta = r.decision ? STATUS_META[r.decision] : null;
        const decColor = decMeta ? TONES[decMeta.tone][1] : 'var(--text3)';
        return <span style={{ fontSize: 12.5, fontWeight: 600, color: decColor }}>{r.decision ? STATUS_META[r.decision].label : '---'}</span>;
      },
    },
    {
      label: 'Creado',
      render: r => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(r.creadoEn)}</span>,
    },
    {
      label: '',
      align: 'right',
      render: r => {
        const resolvable = r.estado === 'PRUEBAS_AGREGADAS';
        return (
          <button
            className="btn-table"
            style={resolvable ? { borderColor: 'var(--violet)', color: 'var(--violet)' } : {}}
            onClick={() => onOpenReport(r.id)}
          >
            {resolvable ? 'Resolver' : 'Ver'}
          </button>
        );
      },
    },
  ];
}
