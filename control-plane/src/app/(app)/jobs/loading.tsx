import { TableRouteLoading } from '@/components/loading/TableRouteLoading';
import { jobsMeta } from '@/features/driver/meta';

export default function Loading() {
  return <TableRouteLoading meta={jobsMeta} cols={6} />;
}
