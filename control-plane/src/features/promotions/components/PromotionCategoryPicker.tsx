import { FormField } from '@/components/common/FormField';
import type { ServiceType } from '@/lib/types';

export function PromotionCategoryPicker({
  services,
  loading,
  selected,
  onToggle,
}: {
  services: ServiceType[];
  loading: boolean;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <FormField label="Categorias">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {loading && services.length === 0 && <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Cargando tipos de servicio...</span>}
        {!loading && services.length === 0 && <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>No hay tipos de servicio disponibles.</span>}
        {services.map(service => {
          const isSelected = selected.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => onToggle(service.id)}
              style={{
                border: `1px solid ${isSelected ? 'var(--pink)' : 'var(--border)'}`,
                borderRadius: 999,
                padding: '6px 13px',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                background: isSelected ? 'var(--pink-soft)' : 'transparent',
                color: isSelected ? 'var(--text)' : 'var(--text2)',
                transition: 'all .12s',
              }}
            >
              {service.nombre}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}
