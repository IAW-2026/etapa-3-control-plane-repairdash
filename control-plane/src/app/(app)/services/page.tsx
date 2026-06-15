'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function ServicesPage() {
  useSyncRoute('services');
  return <TableView route="services" />;
}
