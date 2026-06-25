export type SearchParamInput = Record<string, string | string[] | undefined>;

export const LIST_FILTER_MIN_DATE = '2020-01-01';

export interface ListFilters {
  q: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  page: number;
}

export const DEFAULT_LIST_FILTERS: ListFilters = {
  q: '',
  status: 'ALL',
  dateFrom: '',
  dateTo: '',
  page: 1,
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] || '') : (value || '');
}

function parsePage(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseDateFilter(value: string): string {
  const normalized = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return '';
  return normalized >= LIST_FILTER_MIN_DATE ? normalized : '';
}

export function parseListFilters(searchParams: SearchParamInput = {}): ListFilters {
  return {
    q: first(searchParams.q).trim(),
    status: first(searchParams.status) || 'ALL',
    dateFrom: parseDateFilter(first(searchParams.from)),
    dateTo: parseDateFilter(first(searchParams.to)),
    page: parsePage(first(searchParams.page)),
  };
}

export function filtersToSearchParams(filters: ListFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.q) sp.set('q', filters.q);
  if (filters.status && filters.status !== 'ALL') sp.set('status', filters.status);
  if (filters.dateFrom) sp.set('from', filters.dateFrom);
  if (filters.dateTo) sp.set('to', filters.dateTo);
  if (filters.page > 1) sp.set('page', String(filters.page));
  return sp;
}

export function setListFilterParam(
  current: URLSearchParams,
  key: 'q' | 'status' | 'from' | 'to' | 'page',
  value: string | number,
  resetPage = true,
): URLSearchParams {
  const next = new URLSearchParams(current);
  const raw = String(value).trim();
  const normalized = (key === 'from' || key === 'to') ? parseDateFilter(raw) : raw;

  if (!normalized || normalized === 'ALL' || (key === 'page' && normalized === '1')) {
    next.delete(key);
  } else {
    next.set(key, normalized);
  }

  if (resetPage && key !== 'page') next.delete('page');
  return next;
}

export function paramsHref(pathname: string, params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
