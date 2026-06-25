import { FeedbackView } from '@/features/feedback/FeedbackView';
import { parseListFilters, type SearchParamInput } from '@/lib/search-params';
import { fetchRouteList, fetchSummaryData } from '@/lib/server/list-data';
import type { Report } from '@/lib/types';

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  const filters = parseListFilters(await searchParams);
  const [list, summary] = await Promise.all([
    fetchRouteList<Report>('feedback', filters),
    fetchSummaryData(),
  ]);

  return (
    <FeedbackView
      filters={filters}
      rows={list.items}
      total={list.total}
      totalPages={list.totalPages}
      summary={summary}
    />
  );
}
