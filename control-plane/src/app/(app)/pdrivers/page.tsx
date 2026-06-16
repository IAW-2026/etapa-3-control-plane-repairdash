import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function PDriversPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="pdrivers" searchParams={searchParams} />;
}
