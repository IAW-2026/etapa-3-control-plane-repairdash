'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AppBadge } from '@/components/common/AppBadge';
import { PageHeader } from '@/components/common/PageHeader';
import { useSyncRoute } from '@/lib/routes';
import { setListFilterParam, paramsHref, type ListFilters } from '@/lib/search-params';
import { useStore } from '@/lib/store';
import type { Report, SummaryData } from '@/lib/types';
import { FeedbackFilters } from './components/FeedbackFilters';
import { FeedbackReportsTable } from './components/FeedbackReportsTable';
import { FeedbackSummaryCards } from './components/FeedbackSummaryCards';

export function FeedbackView({
  filters,
  rows,
  total,
  totalPages,
  summary,
}: {
  filters: ListFilters;
  rows: Report[];
  total: number;
  totalPages: number;
  summary: SummaryData | null;
}) {
  useSyncRoute('feedback');
  const { dispatch } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: 'q' | 'status' | 'resFilter', value: string) => {
    const next = setListFilterParam(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(paramsHref(pathname, next));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1280, margin: '0 auto' }}>
      <PageHeader
        title="Feedback y disputas"
        subtitle={
          <>
            Reportes y disputas entre riders y drivers. Feedback es la fuente de verdad: resolver una disputa aca <strong>no modifica Payments</strong> (no frena, destraba ni reembolsa pagos).
          </>
        }
        badge={<AppBadge label="Feedback" tone="pink" />}
      />
      <FeedbackSummaryCards summary={summary} />
      <FeedbackFilters filters={filters} total={total} onUpdate={updateParam} />
      <FeedbackReportsTable
        rows={rows}
        total={total}
        totalPages={totalPages}
        page={filters.page}
        onOpenReport={id => dispatch({ type: 'SET_MODAL', payload: { type: 'report', id, decision: null } })}
      />
    </div>
  );
}
