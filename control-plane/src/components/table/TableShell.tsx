'use client';
import { KeyboardEvent, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { STATUS_META } from '@/lib/utils';
import type { Route } from '@/lib/types';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Pagination } from './Pagination';
import type { TableMeta } from './meta';
import { LIST_FILTER_MIN_DATE, paramsHref, setListFilterParam, type ListFilters } from '@/lib/search-params';
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

  const updateParam = (key: 'q' | 'status' | 'from' | 'to', value: string) => {
    const next = setListFilterParam(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(paramsHref(pathname, next));
  };
  const openDatePicker = (input: HTMLInputElement) => {
    try {
      input.showPicker?.();
    } catch {
      // Some browsers only allow showPicker during trusted pointer/focus events.
    }
  };
  const handleDateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Escape') return;
    e.preventDefault();
    if (e.key === 'Enter' || e.key === ' ') openDatePicker(e.currentTarget);
  };
  const statusOptions = [{ value: 'ALL', label: 'Todos los estados' }, ...(meta.statuses || []).map(st => ({ value: st, label: (STATUS_META[st] || { label: st }).label }))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title={meta.title}
        subtitle={meta.sub}
        badge={meta.app ? <AppBadge label={meta.app} tone={meta.tone} /> : null}
        action={meta.create ? <button className="btn-primary" onClick={onCreate}>{meta.createLabel || '+ Nuevo'}</button> : null}
      />

      {/* Filters */}
      <div className="table-filters" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '18px 0 14px' }}>
        <div className="table-search-filter" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 190, maxWidth: 340, gap: 6 }}>
          <SearchParamInput
            key={`${pathname}:${filters.q}`}
            placeholder={meta.search || 'Buscar...'}
            initialValue={filters.q}
            onApply={value => updateParam('q', value)}
            style={{ flex: 1, minWidth: 0, padding: '9px 13px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5 }}
          />
        </div>
        {meta.statuses && (
          <select aria-label="Filtrar por estado" value={filters.status} onChange={e => updateParam('status', e.target.value)} className="select-base">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {meta.dates && (
          <div className="table-date-filters">
            <label className="table-date-field">
              <span className="table-date-label">Desde</span>
              <input
                type="date"
                aria-label="Fecha desde"
                min={LIST_FILTER_MIN_DATE}
                value={filters.dateFrom}
                onChange={e => updateParam('from', e.target.value)}
                onFocus={e => openDatePicker(e.currentTarget)}
                onClick={e => openDatePicker(e.currentTarget)}
                onKeyDown={handleDateKeyDown}
                className="input-sm table-date-input"
              />
            </label>
            <label className="table-date-field">
              <span className="table-date-label">Hasta</span>
              <input
                type="date"
                aria-label="Fecha hasta"
                min={LIST_FILTER_MIN_DATE}
                value={filters.dateTo}
                onChange={e => updateParam('to', e.target.value)}
                onFocus={e => openDatePicker(e.currentTarget)}
                onClick={e => openDatePicker(e.currentTarget)}
                onKeyDown={handleDateKeyDown}
                className="input-sm table-date-input"
              />
            </label>
          </div>
        )}
        <button
          type="button"
          className="btn-ghost table-clear-filter"
          style={{ minWidth: 120 }}
          onClick={() => router.replace(pathname)}
          disabled={!(filters.q || (filters.status && filters.status !== 'ALL') || (filters.resFilter && filters.resFilter !== 'ALL') || filters.dateFrom || filters.dateTo)}
        >
          Limpiar filtros
        </button>
        <span className="table-results-count" style={{ fontSize: 12.5, color: 'var(--text3)' }}>{total} {total === 1 ? 'resultado' : 'resultados'}</span>
      </div>

      {/* Table container */}
      <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap" style={{ overflowX: 'auto' }}>
          {children(rows)}
        </div>

        {rows.length === 0 && (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>Sin resultados para los filtros aplicados.</div>
        )}

        <Pagination page={filters.page} totalPages={totalPages} total={total} />
      </SectionCard>

      {footer}
    </div>
  );
}
