import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function ViajesPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="viajes" searchParams={searchParams} />;
}
