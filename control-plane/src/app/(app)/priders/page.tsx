'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function PRidersPage() {
  useSyncRoute('priders');
  return <TableView route="priders" />;
}
