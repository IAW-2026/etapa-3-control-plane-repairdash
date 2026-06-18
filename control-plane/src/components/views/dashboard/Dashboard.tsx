'use client';
<<<<<<< Updated upstream
=======
import { useEffect, useSyncExternalStore } from 'react';
>>>>>>> Stashed changes
import { useRouter } from 'next/navigation';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { ROUTE_PATH } from '@/lib/routes';
import { useStore } from '@/lib/store';
import type { Route, SummaryData } from '@/lib/types';
import { buildDashboardModel } from './dashboard-data';
import { CommissionSummaryCard } from './CommissionSummaryCard';
import { DashboardAppCard } from './DashboardAppCard';

<<<<<<< Updated upstream
// `initialSummary` is fetched on the server (see (app)/page.tsx) so the first
// paint already contains real numbers — no skeleton-to-data swap (CLS) and a
// faster LCP. The store still holds the source of truth after client-side
// mutations (e.g. saveResolve refreshes the summary), so we prefer it when set.
export function Dashboard({ initialSummary }: { initialSummary: SummaryData | null }) {
  const { state } = useStore();
=======
const mobileQuery = '(max-width: 640px)';

function subscribeToMobileQuery(callback: () => void) {
  const mq = window.matchMedia(mobileQuery);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function getServerMobileSnapshot() {
  return false;
}

export function Dashboard() {
  const { state, fetchSummary } = useStore();
>>>>>>> Stashed changes
  const { summary, summaryLoading } = state;
  const router = useRouter();
  const go = (route: Route) => router.push(ROUTE_PATH[route]);

<<<<<<< Updated upstream
  const activeSummary = summary ?? initialSummary;
  const loading = summaryLoading && !activeSummary;
  const model = buildDashboardModel(activeSummary, go);
=======
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const loading = summaryLoading && !summary;
  const model = buildDashboardModel(summary, go);
>>>>>>> Stashed changes

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1280, margin: '0 auto', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
      <PageHeader
        title="Vision consolidada"
        subtitle="Estado operativo actual de las tres aplicaciones. Este panel complementa los admins locales: cada app sigue siendo la fuente de verdad de sus datos."
        badge={<AppBadge label="Control Plane" tone="violet" />}
      />

      <div className="dashboard-grid">
        {model.appCards.map(card => <DashboardAppCard key={card.name} card={card} loading={loading} />)}
        <div className="dashboard-commission">
          <CommissionSummaryCard loading={loading} rate={model.commissionRate} updatedAt={model.commissionUpdated} onEdit={() => go('commission')} />
        </div>
      </div>
    </div>
  );
}
