'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTE_PATH } from '@/lib/routes';
import { useStore } from '@/lib/store';
import type { Route } from '@/lib/types';
import { buildDashboardModel } from './dashboard-data';
import { CommissionSummaryCard } from './CommissionSummaryCard';
import { DashboardAppCard } from './DashboardAppCard';
import { TransactionStatusBars } from './TransactionStatusBars';
import { WithdrawalsPendingCard } from './WithdrawalsPendingCard';

export function Dashboard() {
  const { state, fetchSummary } = useStore();
  const { summary, summaryLoading } = state;
  const router = useRouter();
  const go = (route: Route) => router.push(ROUTE_PATH[route]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const loading = summaryLoading && !summary;
  const model = buildDashboardModel(summary, go);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Vision consolidada"
        subtitle="Estado operativo actual de las tres aplicaciones. Este panel complementa los admins locales: cada app sigue siendo la fuente de verdad de sus datos."
        badge={<AppBadge label="Control Plane" tone="violet" />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
        {model.appCards.map(card => <DashboardAppCard key={card.name} card={card} loading={loading} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: 16, alignItems: 'start' }}>
        <TransactionStatusBars bars={model.txBars} loading={loading} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CommissionSummaryCard loading={loading} rate={model.commissionRate} updatedAt={model.commissionUpdated} onEdit={() => go('commission')} />
          <WithdrawalsPendingCard loading={loading} requested={model.sumWdRequested} onReview={() => go('withdrawals')} />
        </div>
      </div>
    </div>
  );
}
