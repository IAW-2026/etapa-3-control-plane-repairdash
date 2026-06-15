'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function TransactionsPage() {
  useSyncRoute('transactions');
  return <TableView route="transactions" />;
}
