import { TableView } from '@/components/views/TableView';
import { parseListFilters, type SearchParamInput } from '@/lib/search-params';
import { fetchRouteList } from '@/lib/server/list-data';
import type { Route } from '@/lib/types';

export async function ServerTablePage({
  route,
  searchParams,
}: {
  route: Route;
  searchParams: Promise<SearchParamInput>;
}) {
  const filters = parseListFilters(await searchParams);
  const result = await fetchRouteList(route, filters);

  return (
    <TableView
      route={route}
      filters={filters}
      rows={result.items}
      total={result.total}
      totalPages={result.totalPages}
    />
  );
}
