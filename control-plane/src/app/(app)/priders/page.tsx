import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function PRidersPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="priders" searchParams={searchParams} />;
}
