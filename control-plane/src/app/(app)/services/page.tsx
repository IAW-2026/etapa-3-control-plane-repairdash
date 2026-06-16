import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function ServicesPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="services" searchParams={searchParams} />;
}
