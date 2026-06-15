'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function JobsPage() {
  useSyncRoute('jobs');
  return <TableView route="jobs" />;
}
