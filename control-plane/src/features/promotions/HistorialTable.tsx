'use client';
import { useStore } from '@/lib/store';
import { money, fdate } from '@/lib/utils';
import type { PromoHistory } from '@/lib/types';

export function HistorialTable({ rows }: { rows: PromoHistory[] }) {
  const { state } = useStore();
  const promotions = state.data.promotions;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
      <thead><tr>
        {['Promoción', 'Usuario', 'Trabajo', 'Original → Pagado', 'Ahorro', 'Fecha'].map((h, i) => <th key={i} className={`th${i === 3 || i === 4 ? ' th-right' : ''}`}>{h}</th>)}
      </tr></thead>
      <tbody>
        {rows.map(h => {
          const promo = promotions.find(p => p.id === h.promocionId);
          return (
            <tr key={h.id} className="tr-base">
              <td className="td">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{h.nombre}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{promo ? (promo.tipoDescuento === '%' ? promo.valor + '% de descuento' : 'Monto fijo') : '—'}</div>
              </td>
              <td className="td" style={{ fontSize: 13.5 }}>{h.usuario}</td>
              <td className="td" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>trabajo #{h.trabajoId}</td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13 }}>
                <span style={{ color: 'var(--text3)', textDecoration: 'line-through' }}>{money(h.valorOriginal)}</span>{' '}
                <span style={{ fontWeight: 600 }}>{money(h.valorPagado)}</span>
              </td>
              <td className="td" style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(h.valorOriginal - h.valorPagado)}</td>
              <td className="td" style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(h.fechaUso)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
