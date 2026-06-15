'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function PDriversPage() {
  useSyncRoute('pdrivers');
  return <TableView route="pdrivers" />;
}
