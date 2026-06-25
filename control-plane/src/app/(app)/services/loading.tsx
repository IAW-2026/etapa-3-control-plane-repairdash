import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { servicesMeta } from '@/features/driver/meta';

export default function Loading() {
  return <TableRouteLoading meta={servicesMeta} cols={5} />;
}
