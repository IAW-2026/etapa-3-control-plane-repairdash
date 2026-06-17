'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTE_PATH } from '@/lib/routes';
import { useStore } from '@/lib/store';
import type { Route } from '@/lib/types';
import { buildDashboardModel } from './dashboard-data';
import { CommissionSummaryCard } from './CommissionSummaryCard';
import { DashboardAppCard } from './DashboardAppCard';

export function Dashboard() {
  const { state, fetchSummary } = useStore();
  const { summary, summaryLoading } = state;
  const router = useRouter();
  const go = (route: Route) => router.push(ROUTE_PATH[route]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const loading = summaryLoading && !summary;
  const model = buildDashboardModel(summary, go);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1280, margin: '0 auto', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
      <PageHeader
        title="Vision consolidada"
        subtitle="Estado operativo actual de las tres aplicaciones. Este panel complementa los admins locales: cada app sigue siendo la fuente de verdad de sus datos."
        badge={<AppBadge label="Control Plane" tone="violet" />}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
        gap: 16,
        alignItems: 'start',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {model.appCards.map(card => <DashboardAppCard key={card.name} card={card} loading={loading} />)}
        <div style={{ gridColumn: isMobile ? '1' : 'span 2' }}>
          <CommissionSummaryCard loading={loading} rate={model.commissionRate} updatedAt={model.commissionUpdated} onEdit={() => go('commission')} />
        </div>
      </div>
    </div>
  );
}