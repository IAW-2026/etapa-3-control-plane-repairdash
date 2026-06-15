'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function HistorialPage() {
  useSyncRoute('historial');
  return <TableView route="historial" />;
}
