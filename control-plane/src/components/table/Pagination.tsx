'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { paramsHref, setListFilterParam } from '@/lib/search-params';

// Mirrors the server-side page size used by the /api/cp/* routes.
export const PAGE_SIZE = 20;

// Shared pager for every server-paginated list (table views + feedback).
// Reads the current page from props and writes page changes into the URL.
export function Pagination({ page, totalPages, total }: { page: number; totalPages: number; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tp = Math.max(1, totalPages);
  const currentPage = Math.min(page, tp);

  const goToPage = (nextPage: number) => {
    const next = setListFilterParam(new URLSearchParams(searchParams.toString()), 'page', nextPage, false);
    router.push(paramsHref(pathname, next));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>
        {total === 0 ? '0 de 0' : `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, total)} de ${total}`}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="btn-table" style={{ opacity: currentPage <= 1 ? .4 : 1, pointerEvents: currentPage <= 1 ? 'none' : 'auto' }} onClick={() => goToPage(Math.max(1, currentPage - 1))}>Anterior</button>
        <span style={{ fontSize: 12.5, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{currentPage} / {tp}</span>
        <button className="btn-table" style={{ opacity: currentPage >= tp ? .4 : 1, pointerEvents: currentPage >= tp ? 'none' : 'auto' }} onClick={() => goToPage(Math.min(tp, currentPage + 1))}>Siguiente</button>
      </div>
    </div>
  );
}
