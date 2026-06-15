'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function ClientesPage() {
  useSyncRoute('clientes');
  return <TableView route="clientes" />;
}
