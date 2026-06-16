import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function JobsPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="jobs" searchParams={searchParams} />;
}
