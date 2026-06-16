import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function WithdrawalsPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="withdrawals" searchParams={searchParams} />;
}
