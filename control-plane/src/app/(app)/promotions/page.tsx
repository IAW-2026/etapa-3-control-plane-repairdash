import { TableView } from '@/components/views/TableView';
import { parseListFilters, type SearchParamInput } from '@/lib/search-params';
import { fetchRouteList, fetchServiceTypeNames } from '@/lib/server/list-data';
import type { Promotion } from '@/lib/types';

// Igual que ServerTablePage pero resolviendo las categorías (IDs → nombres de
// tipo de servicio) en el servidor, así la columna "Categorías" carga directo
// con los nombres y no parpadea con los IDs.
export default async function PromotionsPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  const filters = parseListFilters(await searchParams);
  const [list, names] = await Promise.all([
    fetchRouteList<Promotion>('promotions', filters),
    fetchServiceTypeNames(),
  ]);
  const rows = list.items.map(p => ({
    ...p,
    categoriasNombres: (p.categorias ?? []).map(id => names[id] ?? id),
  }));

  return (
    <TableView
      route="promotions"
      filters={filters}
      rows={rows}
      total={list.total}
      totalPages={list.totalPages}
    />
  );
}
