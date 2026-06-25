import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { pdriversMeta } from '@/features/payments/meta';

export default function Loading() {
  return <TableRouteLoading meta={pdriversMeta} cols={5} />;
}
