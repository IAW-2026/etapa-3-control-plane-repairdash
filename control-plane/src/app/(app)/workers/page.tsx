import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function WorkersPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="workers" searchParams={searchParams} />;
}
