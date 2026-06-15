'use client';
import { useSyncRoute } from '@/lib/routes';
import { TableView } from '@/components/views/TableView';

export default function WithdrawalsPage() {
  useSyncRoute('withdrawals');
  return <TableView route="withdrawals" />;
}
