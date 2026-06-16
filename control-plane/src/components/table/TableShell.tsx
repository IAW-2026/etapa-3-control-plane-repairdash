'use client';
import { useEffect, ReactNode } from 'react';
import { useStore } from '@/lib/store';
import { STATUS_META } from '@/lib/utils';
import type { Route } from '@/lib/types';
import { Pagination } from './Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { TONE_COLORS, type TableMeta } from './meta';

type AnyItem = Record<string, unknown>;

// Generic chrome shared by every table section: header (title/app/endpoint/sub
// + optional create button), filter bar (search / status / dates / count), the
// scrollable table container, loading & empty states, and pagination. The
// actual <table> is supplied per feature through the `children` render-prop,
// which receives the current page of rows. Owns the debounced data fetch keyed
// by `route` + the store's filter state.
export function TableShell({ route, meta, onCreate, footer, children }: {
  route: Route;
  meta: TableMeta;
  onCreate?: () => void;
  footer?: ReactNode;
  children: (rows: AnyItem[]) => ReactNode;
}) {
  const { state, dispatch, fetchRouteData } = useStore();
  const { data, q, status, dateFrom, dateTo, page, loading, serverTotal, totalPages: serverTotalPages, resFilter } = state;
  const tone = TONE_COLORS[meta.tone || 'mut'] || ['var(--mut-soft)', 'var(--mut)'];

  // Load the current page from the real upstream API whenever the route or any
  // filter/pagination input changes. Text search is debounced.
  useEffect(() => {
    const t = setTimeout(() => {
      fetchRouteData(route, { q, status, resFilter, dateFrom, dateTo, page });
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [route, q, status, resFilter, dateFrom, dateTo, page, fetchRouteData]);

  const sliced = (data[meta.dataKey] as unknown as AnyItem[]) || [];
  const total = serverTotal;
  const totalPages = Math.max(1, serverTotalPages);

  const statusOptions = [{ value: 'ALL', label: 'Todos los estados' }, ...(meta.statuses || []).map(st => ({ value: st, label: (STATUS_META[st] || { label: st }).label }))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-grotesk)', fontSize: 'clamp(21px, 3vw, 25px)', fontWeight: 700, margin: 0, letterSpacing: '-.015em' }}>{meta.title}</h1>
            {meta.app && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: tone[0], color: tone[1] }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone[1] }} />{meta.app}
              </span>
            )}
          </div>
          {meta.sub && <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)', maxWidth: '68ch' }}>{meta.sub}</p>}
        </div>
        {meta.create && (
          <button className="btn-primary" onClick={onCreate}>{meta.createLabel || '+ Nuevo'}</button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 14px' }}>
        <input
          placeholder={meta.search || 'Buscar…'}
          value={q}
          onChange={e => dispatch({ type: 'SET_Q', payload: e.target.value })}
          style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, outline: 'none' }}
        />
        {meta.statuses && (
          <select value={status} onChange={e => dispatch({ type: 'SET_STATUS', payload: e.target.value })} className="select-base">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {meta.dates && (
          <>
            <input type="date" value={dateFrom} onChange={e => dispatch({ type: 'SET_DATE_FROM', payload: e.target.value })} className="input-sm" />
            <input type="date" value={dateTo} onChange={e => dispatch({ type: 'SET_DATE_TO', payload: e.target.value })} className="input-sm" />
          </>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text3)' }}>{total} {total === 1 ? 'resultado' : 'resultados'}</span>
      </div>

      {/* Table container */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? <TableSkeleton cols={meta.skeletonCols ?? 5} /> : children(sliced)}
        </div>

        {!loading && sliced.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin resultados para los filtros aplicados.</div>
        )}

        <Pagination page={page} totalPages={totalPages} total={total} />
      </div>

      {footer}
    </div>
  );
}
