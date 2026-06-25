import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function HistorialPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="historial" searchParams={searchParams} />;
}
