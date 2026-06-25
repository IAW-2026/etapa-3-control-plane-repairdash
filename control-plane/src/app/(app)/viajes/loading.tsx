import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { viajesMeta } from '@/features/rider/meta';

export default function Loading() {
  return <TableRouteLoading meta={viajesMeta} cols={6} />;
}
