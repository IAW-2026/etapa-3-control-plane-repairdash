'use client';
import { useStore } from '@/lib/store';
import { money, fdate, getBadge, promoEstado, promoValor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Table, type Column } from '@/components/table/Table';
import type { Promotion } from '@/lib/types';
import { useServiceTypes } from './useServiceTypes';

export function PromotionsTable({ rows }: { rows: Promotion[] }) {
  const { dispatch, deletePromo } = useStore();
  const { services } = useServiceTypes();
  const serviceNameById = new Map(services.map(s => [s.id, s.nombre]));
  const formatCategorias = (categorias: string[]) =>
    categorias.length ? categorias.map(c => serviceNameById.get(c) || c).join(', ') : 'Todas';

  const columns: Column[] = [
    {
      label: 'Promoción',
      render: p => (
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {p.destacada && <span style={{ color: 'var(--warn)', fontSize: 13 }}>★</span>}
            <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'normal' }}>{p.nombre}</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{p.descripcion}</div>
        </div>
      ),
    },
    {
      label: 'Descuento',
      render: p => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pink)' }}>{promoValor(p)}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{p.tipoDescuento === '%' ? 'Porcentaje' : 'Monto fijo'}{p.precioMinimo ? ' · mín ' + money(p.precioMinimo) : ''}</div>
        </div>
      ),
    },
    {
      label: 'Categorías',
      render: p => <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{formatCategorias(p.categorias)}</span>,
    },
    {
      label: 'Vigencia',
      render: p => <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{fdate(p.fechaInicio)} → {p.fechaFin ? fdate(p.fechaFin) : 'sin venc.'}</span>,
    },
    {
      label: 'Estado',
      render: p => {
        const est = promoEstado(p);
        const b = getBadge(est);
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            {p.usoUnico && <span style={{ fontSize: 10.5, color: 'var(--text3)' }}>Uso único</span>}
            <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />
          </div>
        );
      },
    },
    {
      label: '',
      align: 'right',
      render: p => {
        const disabled = p.eliminada;
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-table" style={{ marginRight: 6, opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'promo', id: p.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: p.nombre, descripcion: p.descripcion, tipoDescuento: p.tipoDescuento, valor: p.valor, categorias: [...p.categorias], precioMinimo: p.precioMinimo == null ? '' : p.precioMinimo, destacada: p.destacada, usoUnico: p.usoUnico, fechaInicio: p.fechaInicio.slice(0, 10), fechaFin: p.fechaFin ? p.fechaFin.slice(0, 10) : '' } }); }}>Editar</button>
            <button className="btn-table btn-table-danger" style={{ opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar promoción', desc: `Se marca la promoción "${p.nombre}" como eliminada y deja de verse para los usuarios al instante.`, fn: () => deletePromo(p.id, p.nombre) } })}>Eliminar</button>
          </div>
        );
      },
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
