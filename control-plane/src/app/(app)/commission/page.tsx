'use client';
import { useSyncRoute } from '@/lib/routes';
import { CommissionView } from '@/features/payments/CommissionView';

export default function CommissionPage() {
  useSyncRoute('commission');
  return <CommissionView />;
}
