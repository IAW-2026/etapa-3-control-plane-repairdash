'use client';
import { useEffect } from 'react';
import { useStore } from './store';
import type { Route } from './types';

// Single source of truth mapping each logical section (Route) to its real
// Next.js URL. Used by the Sidebar (links + active state), the Header
// (breadcrumb derived from the URL) and the Dashboard (navigation links).
export const ROUTE_PATH: Record<Route, string> = {
  dashboard:    '/',
  clientes:     '/clientes',
  workers:      '/workers',
  pdrivers:     '/pdrivers',
  priders:      '/priders',
  jobs:         '/jobs',
  viajes:       '/viajes',
  services:     '/services',
  transactions: '/transactions',
  withdrawals:  '/withdrawals',
  commission:   '/commission',
  promotions:   '/promotions',
  historial:    '/historial',
  feedback:     '/feedback',
};

// Inverse map: pathname → Route. Used by the Header to resolve the current
// section from the URL.
export const PATH_ROUTE: Record<string, Route> = Object.fromEntries(
  (Object.entries(ROUTE_PATH) as [Route, string][]).map(([route, path]) => [path, route])
) as Record<string, Route>;

export function routeFromPath(pathname: string): Route {
  return PATH_ROUTE[pathname] ?? 'dashboard';
}

// Keeps the store's `route` in sync with the page that is currently mounted.
// Dispatching SET_ROUTE resets the per-section filters (q, status, page,
// dates…), so navigating between table pages no longer drags stale filters
// from the previous section. The data-fetching effects in TableView /
// FeedbackView keep reading `route` from the store unchanged.
export function useSyncRoute(route: Route) {
  const { state, dispatch } = useStore();
  useEffect(() => {
    if (state.route !== route) dispatch({ type: 'SET_ROUTE', payload: route });
    // Only react to the page's own route changing (constant per page file).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
}
