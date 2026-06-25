'use client';
import { useEffect, useState } from 'react';
import { money, fdate } from '@/lib/utils';
import { Table, type Column } from '@/components/table/Table';
import type { PromoHistory, Promotion } from '@/lib/types';

export function HistorialTable({ rows }: { rows: PromoHistory[] }) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    let alive = true;

    fetch('/api/cp/promotions?page=1&limit=1000', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!alive) return;
        setPromotions(Array.isArray(json?.items) ? json.items : []);
      })
      .catch(() => {
        if (alive) setPromotions([]);
      });

    return () => { alive = false; };
  }, []);

  const columns: Column[] = [
    {
      label: 'Promoción',
      render: h => {
        const promo = promotions.find(p => p.id === h.promocionId);
        return (<><div style={{ fontSize: 14, fontWeight: 600 }}>{h.nombre}</div><div style={{ fontSize: 11.5, color: 'var(--text3)' }}>{promo ? (promo.tipoDescuento === '%' ? promo.valor + '% de descuento' : `${money(promo.valor)} de descuento`) : '—'}</div></>);
      },
    },
    {
      label: 'Usuario',
      render: h => <span style={{ fontSize: 13.5 }}>{h.usuario}</span>,
    },
    {
      label: 'Trabajo',
      render: h => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>trabajo #{h.trabajoId}</span>,
    },
    {
      label: 'Original → Pagado',
      align: 'right',
      render: h => (<><span style={{ color: 'var(--text3)', textDecoration: 'line-through' }}>{money(h.valorOriginal)}</span>{' '}<span style={{ fontWeight: 600 }}>{money(h.valorPagado)}</span></>),
    },
    {
      label: 'Ahorro',
      align: 'right',
      render: h => <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ok)' }}>{money(h.valorOriginal - h.valorPagado)}</span>,
    },
    {
      label: 'Fecha',
      render: h => <span style={{ fontSize: 13, color: 'var(--text2)' }}>{fdate(h.fechaUso)}</span>,
    },
  ];

  return <Table columns={columns} rows={rows} />;
}
