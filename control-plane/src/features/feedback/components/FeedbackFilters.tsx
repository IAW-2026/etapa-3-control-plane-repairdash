import { usePathname } from 'next/navigation';
import { SearchParamInput } from '@/components/table/SearchParamInput';
import type { ListFilters } from '@/lib/search-params';

export function FeedbackFilters({
  filters,
  total,
  onUpdate,
}: {
  filters: ListFilters;
  total: number;
  onUpdate: (key: 'q' | 'status', value: string) => void;
}) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <SearchParamInput
        key={`${pathname}:${filters.q}`}
        placeholder="Buscar por ID, usuario o trabajo..."
        initialValue={filters.q}
        onApply={value => onUpdate('q', value)}
        className="select-base"
        style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, borderRadius: 10 }}
      />
      <select aria-label="Filtrar por estado del reporte" value={filters.status} onChange={e => onUpdate('status', e.target.value)} className="select-base">
        <option value="ALL">Todos los estados</option>
        <option value="CREADO">Creado</option>
        <option value="PRUEBAS_AGREGADAS">En revision</option>
        <option value="RESUELTO">Resuelto</option>
      </select>
      <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text3)' }}>
        {total} {total === 1 ? 'reporte' : 'reportes'}
      </span>
    </div>
  );
}
