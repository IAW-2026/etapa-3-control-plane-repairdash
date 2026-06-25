'use client';
import { useEffect } from 'react';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { useStore } from '@/lib/store';
import { CommissionForm } from './CommissionForm';
import { CurrentCommissionCard } from './CurrentCommissionCard';

export function CommissionView() {
  const { state, fetchCommission } = useStore();
  const { data } = state;
  const rate = data.commission.rate;
  const loading = rate === '---' || rate === 'â€”';

  useEffect(() => { fetchCommission(); }, [fetchCommission]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 640, margin: '0 auto' }}>
      <PageHeader title="Comision de plataforma" badge={<AppBadge label="Payments" tone="mag" />} />

      <SectionCard style={{ gap: 18, display: 'flex', flexDirection: 'column' }}>
        <CurrentCommissionCard loading={loading} rate={rate} updatedAt={data.commission.updatedAt} />
        <div style={{ height: 1, background: 'var(--border)' }} />
        <CommissionForm />
      </SectionCard>
    </div>
  );
}
