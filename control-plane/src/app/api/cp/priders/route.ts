import { NextRequest, NextResponse } from 'next/server';
import { ENV, pmHeaders, configured } from '@/lib/server/config';
import type { PRider } from '@/lib/types';

function normalize(item: Record<string, unknown>): PRider {
  const cliente = item.cliente as Record<string, unknown> | undefined;
  const user    = item.user    as Record<string, unknown> | undefined;
  return {
    clerkId: (cliente?.clerkId as string) || (user?.clerkId as string) || '',
    name:    (user?.fullName   as string) || '—',
    email:   (user?.email      as string) || '—',
    txs:     (item.transactionCount   as number) || 0,
    volume:  (item.volumePaid         as string) || '0.00',
    last:    (item.latestTransactionAt as string) || '',
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.payments.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q    = req.nextUrl.searchParams.get('q')    || '';
    const page = req.nextUrl.searchParams.get('page') || '1';
    if (q) sp.set('q', q);
    sp.set('page', page);
    sp.set('pageSize', '20');

    const res = await fetch(`${ENV.payments.base}/api/control-plane/riders?${sp}`, {
      headers: pmHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: PRider[] = (json.items || []).map(normalize);
    const pag = json.pagination || {};
    return NextResponse.json({
      items,
      totalPages: pag.totalPages || 1,
      total:      pag.totalCount || items.length,
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con Payments' }, { status: 503 });
  }
}
