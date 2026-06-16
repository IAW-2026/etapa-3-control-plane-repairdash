import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function ClientesPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="clientes" searchParams={searchParams} />;
}
