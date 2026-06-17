'use client';
import { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { STATUS_META } from '@/lib/utils';
import type { Route } from '@/lib/types';
import { Pagination } from './Pagination';
import { TONE_COLORS, type TableMeta } from './meta';
import { paramsHref, setListFilterParam, type ListFilters } from '@/lib/search-params';
import { SearchParamInput } from './SearchParamInput';

type AnyItem = Record<string, unknown>;

// Generic chrome shared by every table section: header, URL-driven filters,
// scrollable table container, empty state and pagination. The page owns the
// server fetch and passes the current rows in.
export function TableShell({ route: _route, meta, filters, rows, total, totalPages, onCreate, footer, children }: {
  route: Route;
  meta: TableMeta;
  filters: ListFilters;
  rows: AnyItem[];
  total: number;
  totalPages: number;
  onCreate?: () => void;
  footer?: ReactNode;
  children: (rows: AnyItem[]) => ReactNode;
}) {
  void _route;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tone = TONE_COLORS[meta.tone || 'mut'] || ['var(--mut-soft)', 'var(--mut)'];

  const updateParam = (key: 'q' | 'status' | 'from' | 'to', value: string) => {
    const next = setListFilterParam(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(paramsHref(pathname, next));
  };
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
        <SearchParamInput
          key={`${pathname}:${filters.q}`}
          placeholder={meta.search || 'Buscar...'}
          initialValue={filters.q}
          onApply={value => updateParam('q', value)}
          style={{ flex: 1, minWidth: 190, maxWidth: 340, padding: '9px 13px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, outline: 'none' }}
        />
        {meta.statuses && (
          <select value={filters.status} onChange={e => updateParam('status', e.target.value)} className="select-base">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {meta.dates && (
          <>
            <input type="date" value={filters.dateFrom} onChange={e => updateParam('from', e.target.value)} className="input-sm" />
            <input type="date" value={filters.dateTo} onChange={e => updateParam('to', e.target.value)} className="input-sm" />
          </>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text3)' }}>{total} {total === 1 ? 'resultado' : 'resultados'}</span>
      </div>

      {/* Table container */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          {children(rows)}
        </div>

        {rows.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin resultados para los filtros aplicados.</div>
        )}

        <Pagination page={filters.page} totalPages={totalPages} total={total} />
      </div>

      {footer}
    </div>
  );
}
