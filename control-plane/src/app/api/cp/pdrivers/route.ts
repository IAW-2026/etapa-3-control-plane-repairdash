import { NextRequest, NextResponse } from 'next/server';
import { ENV, pmHeaders, configured } from '@/lib/server/config';
import type { PDriver } from '@/lib/types';

function normalize(item: Record<string, unknown>): PDriver {
  const trab = item.trabajador as Record<string, unknown> | undefined;
  const user = item.user       as Record<string, unknown> | undefined;
  const bal  = item.balance    as Record<string, unknown> | undefined;
  return {
    clerkId: (trab?.clerkId  as string) || (user?.clerkId as string) || '',
    name:    (user?.fullName as string) || '—',
    email:   (user?.email    as string) || '—',
    cbu:     (trab?.cbuCvu   as string) || '—',
    avail:   (bal?.balanceAvailable as string) || '0.00',
    locked:  (bal?.balanceLocked    as string) || '0.00',
    txs:     (item.transactionCount as number) || 0,
    wds:     (item.withdrawalCount  as number) || 0,
    last:    (item.latestActivityAt as string) || '',
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

    const res = await fetch(`${ENV.payments.base}/api/control-plane/drivers?${sp}`, {
      headers: pmHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: PDriver[] = (json.items || []).map(normalize);
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
