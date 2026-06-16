import { ServerTablePage } from '@/components/views/ServerTablePage';
import type { SearchParamInput } from '@/lib/search-params';

export default function PromotionsPage({ searchParams }: { searchParams: Promise<SearchParamInput> }) {
  return <ServerTablePage route="promotions" searchParams={searchParams} />;
}
