import type { ReportTrabajo } from '@/lib/types';
import { fdate } from '@/lib/utils';

export function ReportJobCard({ trabajo }: { trabajo: ReportTrabajo }) {
  const dates = fdate(trabajo.fechaInicio) + (trabajo.fechaFin ? ' -> ' + fdate(trabajo.fechaFin) : ' -> en curso');

  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)' }}>Trabajo asociado</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{trabajo.id}</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{trabajo.tipoDeTrabajo}</span>
        <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{dates}</span>
      </div>
    </div>
  );
}
