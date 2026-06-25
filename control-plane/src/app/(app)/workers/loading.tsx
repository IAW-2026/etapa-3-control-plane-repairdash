import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { workersMeta } from '@/features/driver/meta';

export default function Loading() {
  return <TableRouteLoading meta={workersMeta} cols={6} />;
}
