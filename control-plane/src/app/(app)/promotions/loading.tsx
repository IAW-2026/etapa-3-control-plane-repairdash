import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { promotionsMeta } from '@/features/promotions/meta';

export default function Loading() {
  return <TableRouteLoading meta={promotionsMeta} cols={6} />;
}
