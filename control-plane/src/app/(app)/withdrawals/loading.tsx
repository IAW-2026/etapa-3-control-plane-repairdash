import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { withdrawalsMeta } from '@/features/payments/meta';

export default function Loading() {
  return <TableRouteLoading meta={withdrawalsMeta} cols={5} />;
}
