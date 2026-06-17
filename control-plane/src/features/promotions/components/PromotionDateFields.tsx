import { FormField } from '@/components/common/FormField';

export function PromotionDateFields({
  fechaInicio,
  fechaFin,
  onChange,
}: {
  fechaInicio: string;
  fechaFin: string;
  onChange: (key: 'fechaInicio' | 'fechaFin', value: string) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <FormField label="Fecha de inicio">
        <input type="date" value={fechaInicio} onChange={e => onChange('fechaInicio', e.target.value)} className="input-sm" style={{ color: 'var(--text)' }} />
      </FormField>
      <FormField label={<span>Fecha de fin <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(opcional)</span></span>}>
        <input type="date" value={fechaFin} onChange={e => onChange('fechaFin', e.target.value)} className="input-sm" style={{ color: 'var(--text)' }} />
      </FormField>
    </div>
  );
}
