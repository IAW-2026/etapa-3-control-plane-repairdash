'use client';
import { useStore } from '@/lib/store';
import { money } from '@/lib/utils';
import { Table, type Column } from '@/components/table/Table';
import type { ServiceType } from '@/lib/types';

export function ServicesTable({ rows }: { rows: ServiceType[] }) {
  const { dispatch, deleteService } = useStore();

  const columns: Column[] = [
    {
      label: 'Servicio',
      render: t => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{t.nombre}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{t.descripcion}</div></>),
    },
    {
      label: 'Precio base',
      align: 'right',
      render: t => <span style={{ fontSize: 13.5, fontWeight: 600 }}>{money(t.precioBase)}</span>,
    },
    {
      label: 'Drivers',
      align: 'right',
      render: t => <span style={{ fontSize: 13.5 }}>{t.drivers}</span>,
    },
    {
      label: 'Trabajos activos',
      align: 'right',
      render: t => <span style={{ fontSize: 13.5 }}>{t.activos}</span>,
    },
    {
      label: '',
      align: 'right',
      render: t => (<>
        <button className="btn-table" style={{ marginRight: 6 }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'service', id: t.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: t.nombre, descripcion: t.descripcion, precio: t.precioBase } }); }}>Editar</button>
        <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar tipo de servicio', desc: `Se elimina "${t.nombre}" del catálogo de DriverApp. Si tiene trabajos activos asociados, no se podrá eliminar.`, fn: () => deleteService(t.id, t.nombre) } })}>Eliminar</button>
      </>),
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
