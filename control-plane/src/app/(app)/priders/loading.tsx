import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { pridersMeta } from '@/features/payments/meta';

export default function Loading() {
  return <TableRouteLoading meta={pridersMeta} cols={4} />;
}
