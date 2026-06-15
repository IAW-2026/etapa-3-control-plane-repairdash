'use client';
import { useStore } from '@/lib/store';
import type { Cliente } from '@/lib/types';

export function ClientesTable({ rows }: { rows: Cliente[] }) {
  const { state, dispatch, deleteCliente } = useStore();
  const viajes = state.data.viajes;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
      <thead><tr>
        {['Cliente', 'Clerk ID', 'Calificación', 'Viajes', ''].map((h, i) => <th key={i} className={`th${i === 4 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(c => {
          const viajesCount = viajes.filter(v => v.id_clerk === c.id_clerk).length;
          return (
            <tr key={c.id_clerk} className="tr-base">
              <td className="td"><div style={{ fontSize: 14, fontWeight: 600 }}>{c.nombre} {c.apellido}</div><div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.mail}</div></td>
              <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>{c.id_clerk}</td>
              <td className="td" style={{ fontSize: 13.5, color: 'var(--warn)', fontWeight: 600 }}>{c.calificacion == null ? '—' : '★ ' + c.calificacion.toFixed(1)}</td>
              <td className="td" style={{ fontSize: 13.5 }}>{viajesCount}</td>
              <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button className="btn-table" style={{ marginRight: 6 }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'cliente', id: c.id_clerk, name: c.nombre + ' ' + c.apellido } }); dispatch({ type: 'SET_FORM', payload: { nombre: c.nombre, apellido: c.apellido } }); }}>Editar</button>
                <button className="btn-table btn-table-danger" onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar cliente', desc: `Se elimina el registro de ${c.nombre} ${c.apellido} en la base de RepairDash. No elimina al usuario en Clerk.`, endpoint: 'DELETE /api/super-admin/clientes/' + c.id_clerk, fn: () => deleteCliente(c.id_clerk) } })}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
