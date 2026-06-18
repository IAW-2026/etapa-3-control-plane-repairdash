import { Dashboard } from '@/components/views/Dashboard';
import { fetchSummaryData } from '@/lib/server/list-data';

// Rendered fresh per request so the dashboard ships with real numbers in the
// initial HTML (good LCP) instead of painting skeletons and swapping data in
// after a client fetch (which caused CLS).
export const dynamic = 'force-dynamic';

export default async function Home() {
  const summary = await fetchSummaryData();
  return <Dashboard initialSummary={summary} />;
}
