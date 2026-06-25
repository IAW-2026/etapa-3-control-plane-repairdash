import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { clientesMeta } from '@/features/rider/meta';

export default function Loading() {
  return <TableRouteLoading meta={clientesMeta} cols={6} />;
}
