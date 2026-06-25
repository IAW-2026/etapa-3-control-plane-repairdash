import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { historialMeta } from '@/features/promotions/meta';

export default function Loading() {
  return <TableRouteLoading meta={historialMeta} cols={5} />;
}
