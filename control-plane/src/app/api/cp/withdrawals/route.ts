import { NextRequest, NextResponse } from 'next/server';
import { ENV, pmHeaders, configured } from '@/lib/server/config';
import type { Withdrawal } from '@/lib/types';

function normalize(item: Record<string, unknown>): Withdrawal {
  const wd   = item.withdrawal as Record<string, unknown> | undefined;
  const trab = item.trabajador as Record<string, unknown> | undefined;
  const user = item.user       as Record<string, unknown> | undefined;
  return {
    id:        (wd?.id as string)      || '',
    driver:    (user?.fullName as string) || (wd?.trabajadorId as string) || '—',
    cbu:       (trab?.cbuCvu as string)|| '—',
    amount:    (wd?.amount as string)  || '0.00',
    status:    (wd?.status as string)  || '',
    createdAt: (wd?.createdAt as string) || '',
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.payments.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q      = req.nextUrl.searchParams.get('q')      || '';
    const status = req.nextUrl.searchParams.get('status') || '';
    const from   = req.nextUrl.searchParams.get('from')   || '';
    const to     = req.nextUrl.searchParams.get('to')     || '';
    const page   = req.nextUrl.searchParams.get('page')   || '1';
    if (q)                       sp.set('q', q);
    if (status && status !== 'ALL') sp.set('status', status);
    if (from)                    sp.set('from', from);
    if (to)                      sp.set('to', to);
    sp.set('page', page);
    sp.set('pageSize', '20');

    const res = await fetch(`${ENV.payments.base}/api/control-plane/withdrawals?${sp}`, {
      headers: pmHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: Withdrawal[] = (json.items || []).map(normalize);
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
