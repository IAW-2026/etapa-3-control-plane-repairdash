'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function WorkersPage() {
  useSyncRoute('workers');
  return <TableView route="workers" />;
}
