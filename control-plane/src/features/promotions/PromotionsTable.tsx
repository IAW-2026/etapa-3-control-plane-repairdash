'use client';
import { useStore } from '@/lib/store';
import { money, fdate, getBadge, promoEstado, promoValor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Promotion } from '@/lib/types';
import { useServiceTypes } from './useServiceTypes';

export function PromotionsTable({ rows }: { rows: Promotion[] }) {
  const { dispatch, deletePromo } = useStore();
  const { services } = useServiceTypes();
  const serviceNameById = new Map(services.map(s => [s.id, s.nombre]));
  const formatCategorias = (categorias: string[]) =>
    categorias.length ? categorias.map(c => serviceNameById.get(c) || c).join(', ') : 'Todas';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
      <thead><tr>
        {['Promoción', 'Descuento', 'Categorías', 'Vigencia', 'Estado', ''].map((h, i) => <th key={i} className={`th${i === 5 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(p => {
          const est = promoEstado(p);
          const b = getBadge(est);
          const disabled = p.eliminada;
          return (
            <tr key={p.id} className="tr-base">
              <td className="td" style={{ maxWidth: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {p.destacada && <span style={{ color: 'var(--warn)', fontSize: 13 }}>★</span>}
                  <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.descripcion}</div>
              </td>
              <td className="td">
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pink)' }}>{promoValor(p)}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{p.tipoDescuento === '%' ? 'Porcentaje' : 'Monto fijo'}{p.precioMinimo ? ' · mín ' + money(p.precioMinimo) : ''}</div>
              </td>
              <td className="td" style={{ fontSize: 12.5, color: 'var(--text2)' }}>{formatCategorias(p.categorias)}</td>
              <td className="td" style={{ fontSize: 12.5, color: 'var(--text2)' }}>{fdate(p.fechaInicio)} → {p.fechaFin ? fdate(p.fechaFin) : 'sin venc.'}</td>
              <td className="td">
                <Badge label={b.badgeLabel} bg={b.badgeBg} fg={b.badgeFg} />
                {p.usoUnico && <span style={{ display: 'block', marginTop: 4, fontSize: 10.5, color: 'var(--text3)' }}>Uso único</span>}
              </td>
              <td className="td" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button className="btn-table" style={{ marginRight: 6, opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => { dispatch({ type: 'SET_MODAL', payload: { type: 'promo', id: p.id } }); dispatch({ type: 'SET_FORM', payload: { nombre: p.nombre, descripcion: p.descripcion, tipoDescuento: p.tipoDescuento, valor: p.valor, categorias: [...p.categorias], precioMinimo: p.precioMinimo == null ? '' : p.precioMinimo, destacada: p.destacada, usoUnico: p.usoUnico, fechaInicio: p.fechaInicio.slice(0, 10), fechaFin: p.fechaFin ? p.fechaFin.slice(0, 10) : '' } }); }}>Editar</button>
                <button className="btn-table btn-table-danger" style={{ opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto' }} onClick={() => dispatch({ type: 'SET_MODAL', payload: { type: 'confirm', title: 'Eliminar promoción', desc: `Se marca la promoción "${p.nombre}" como eliminada y deja de verse para los usuarios al instante.`, fn: () => deletePromo(p.id, p.nombre) } })}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
