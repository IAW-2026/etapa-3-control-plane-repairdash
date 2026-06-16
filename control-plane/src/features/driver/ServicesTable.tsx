'use client';
import { useStore } from '@/lib/store';
import { money } from '@/lib/utils';
import type { ServiceType } from '@/lib/types';

export function ServicesTable({ rows }: { rows: ServiceType[] }) {
  const { dispatch, deleteService } = useStore();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
      <thead><tr>
        {['Servicio', 'Precio base', 'Drivers', 'Trabajos activos', ''].map((h, i) => <th key={i} className={`th${i === 1 || i === 2 || i === 3 || i === 4 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(t => (
          <tr key={t.id} className="tr-base">
            <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{t.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{t.descripcion}</div></td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600 }}>{money(t.precioBase)}</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{t.drivers}</td>
            <td className="td" style={{ textAlign: 'right', fontSize: 13.5 }}>{t.activos}</td>
            <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              <button className="btn-table" style={{ marginRight: 6 }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'service', id: t.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: t.nombre, descripcion: t.descripcion, precio: t.precioBase } }); }}>Editar</button>
              <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar tipo de servicio', desc: `Se elimina "${t.nombre}" del catálogo de DriverApp. Si tiene trabajos activos asociados, no se podrá eliminar.`, fn: () => deleteService(t.id, t.nombre) } })}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
