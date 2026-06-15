'use client';
import { useStore } from '@/lib/store';
import { TableShell } from '@/components/table/TableShell';
import { TABLE_REGISTRY } from '@/features/registry';
import type { Route } from '@/lib/types';

// Thin dispatcher: looks up the feature entry for the route and renders the
// shared TableShell with that feature's <table>. All per-domain table markup
// lives under src/features/<domain>/.
export function TableView({ route }: { route: Route }) {
  const { dispatch } = useStore();
  const entry = TABLE_REGISTRY[route];
  if (!entry) return null;
  const { meta, render, footer } = entry;

  const onCreate = meta.create
    ? () => {
        if (route === 'promotions') {
          dispatch({ type: 'SET_MODAL', payload: { type: 'promo', id: null } });
          dispatch({ type: 'SET_FORM', payload: { nombre: '', descripcion: '', tipoDescuento: 'porcentaje', valor: '', categorias: [], precioMinimo: '', destacada: false, usoUnico: false, fechaInicio: '', fechaFin: '' } });
        } else {
          dispatch({ type: 'SET_MODAL', payload: { type: 'service', id: null } });
          dispatch({ type: 'SET_FORM', payload: { nombre: '', descripcion: '', precio: '' } });
        }
      }
    : undefined;

  return (
    <TableShell route={route} meta={meta} onCreate={onCreate} footer={footer}>
      {render}
    </TableShell>
  );
}
