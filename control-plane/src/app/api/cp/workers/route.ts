import { NextRequest, NextResponse } from 'next/server';
import { ENV, drHeaders, configured } from '@/lib/server/config';
import type { Worker } from '@/lib/types';

function normalize(w: Record<string, unknown>): Worker {
  const svc = (w.tiposServicio as { nombre: string }[] | undefined) || [];
  return {
    id:         (w.id as string) || (w.clerkUserId as string),
    nombre:     (w.nombre as string) || '—',
    email:      (w.email as string)  || '—',
    status:     (w.status as Worker['status']) || 'OFFLINE',
    onboarding: !!(w.onboardingCompleto),
    servicios:  svc.map(s => s.nombre).join(', ') || '—',
    creadoEn:   (w.creadoEn as string) || '',
  };
}

export async function GET(req: NextRequest) {
  if (!configured(ENV.driver.base)) {
    return NextResponse.json({ items: [], totalPages: 1, total: 0 });
  }
  try {
    const sp = new URLSearchParams();
    const q      = req.nextUrl.searchParams.get('q')      || '';
    const status = req.nextUrl.searchParams.get('status') || '';
    const page   = req.nextUrl.searchParams.get('page')   || '1';
    if (q)                      sp.set('q', q);
    if (status && status !== 'ALL') sp.set('status', status);
    sp.set('page', page);
    sp.set('limit', '20');

    const res = await fetch(`${ENV.driver.base}/api/control-plane/workers?${sp}`, {
      headers: drHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: 'Upstream error' }, { status: res.status });
    const json = await res.json();

    const items: Worker[] = (json.data || []).map(normalize);
    const pag = json.pagination || {};
    return NextResponse.json({
      items,
      totalPages: pag.totalPages || 1,
      total:      pag.total      || items.length,
    });
  } catch {
    return NextResponse.json({ error: 'Error de conexión con DriverApp' }, { status: 503 });
  }
}
