import { cookies, headers } from 'next/headers';
import type { Route, SummaryData } from '@/lib/types';
import { filtersToSearchParams, type ListFilters } from '@/lib/search-params';

export interface ListDataResult<T = Record<string, unknown>> {
  items: T[];
  total: number;
  totalPages: number;
}

const ROUTE_ENDPOINT: Partial<Record<Route, string>> = {
  clientes: '/api/cp/clientes',
  viajes: '/api/cp/viajes',
  workers: '/api/cp/workers',
  jobs: '/api/cp/jobs',
  services: '/api/cp/services',
  pdrivers: '/api/cp/pdrivers',
  priders: '/api/cp/priders',
  transactions: '/api/cp/transactions',
  withdrawals: '/api/cp/withdrawals',
  promotions: '/api/cp/promotions',
  historial: '/api/cp/historial',
  feedback: '/api/cp/reports',
};

async function appOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

async function internalJson<T>(path: string): Promise<T | null> {
  const origin = await appOrigin();
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${origin}${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

export async function fetchRouteList<T = Record<string, unknown>>(
  route: Route,
  filters: ListFilters,
): Promise<ListDataResult<T>> {
  const endpoint = ROUTE_ENDPOINT[route];
  if (!endpoint) return { items: [], total: 0, totalPages: 1 };

  const qs = filtersToSearchParams(filters).toString();
  const json = await internalJson<ListDataResult<T>>(`${endpoint}${qs ? `?${qs}` : ''}`);
  const total = typeof json?.total === 'number' ? json.total : 0;
  const totalPages = typeof json?.totalPages === 'number' ? json.totalPages : 1;
  return {
    items: Array.isArray(json?.items) ? json.items : [],
    total,
    totalPages: Math.max(1, totalPages),
  };
}

export async function fetchSummaryData(): Promise<SummaryData | null> {
  return internalJson<SummaryData>('/api/cp/summary');
}
