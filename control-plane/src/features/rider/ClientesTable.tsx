'use client';
import { useStore } from '@/lib/store';
import { Table, type Column } from '@/components/table/Table';
import type { Cliente } from '@/lib/types';

export function ClientesTable({ rows }: { rows: Cliente[] }) {
  const { state, dispatch, deleteCliente } = useStore();
  const viajes = state.data.viajes;

  const columns: Column[] = [
    {
      label: 'Cliente',
      render: c => (<><div style={{ fontSize: 14, fontWeight: 600 }}>{c.nombre} {c.apellido}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.mail}</div></>),
    },
    {
      label: 'Clerk ID',
      render: c => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', whiteSpace: 'normal', wordBreak: 'break-all' }}>{c.id_clerk}</span>,
    },
    {
      label: 'Calificación',
      render: c => <span style={{ fontSize: 13.5, color: 'var(--warn)', fontWeight: 600 }}>{c.calificacion == null ? '—' : '★ ' + c.calificacion.toFixed(1)}</span>,
    },
    {
      label: 'Viajes',
      render: c => <span style={{ fontSize: 13.5 }}>{viajes.filter(v => v.id_clerk === c.id_clerk).length}</span>,
    },
    {
      label: '',
      align: 'right',
      render: c => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn-table" onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'cliente', id: c.id_clerk, name: c.nombre + ' ' + c.apellido } }); dispatch({ type: 'SET_FORM', payload: { nombre: c.nombre, apellido: c.apellido } }); }}>Editar</button>
          <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar cliente', desc: `Se elimina el registro de ${c.nombre} ${c.apellido} en RepairDash. Esta acción no se puede deshacer.`, fn: () => deleteCliente(c.id_clerk, `${c.nombre} ${c.apellido}`.trim()) } })}>Eliminar</button>
        </div>
      ),
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
