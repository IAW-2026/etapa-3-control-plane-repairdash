import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { transactionsMeta } from '@/features/payments/meta';

export default function Loading() {
  return <TableRouteLoading meta={transactionsMeta} cols={6} />;
}
